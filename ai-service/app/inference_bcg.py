# app/inference_bcg.py
import numpy as np
import pandas as pd
import joblib
import json
import os

BASE_DIR    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR  = os.path.join(BASE_DIR, 'models')

_kmeans  = None
_scaler  = None
_mapping = None

def _load_models():
    global _kmeans, _scaler, _mapping
    if _kmeans is None:
        print("Loading BCG models...")
        _kmeans = joblib.load(os.path.join(MODELS_DIR, 'kmeans_bcg.pkl'))
        _scaler = joblib.load(os.path.join(MODELS_DIR, 'scaler_bcg.pkl'))
        with open(os.path.join(MODELS_DIR, 'bcg_cluster_mapping.json')) as f:
            _mapping = json.load(f)
        print("BCG models siap!")

def prediksi_bcg(produk_list: list) -> dict:
    """
    Klasifikasi produk ke kuadran BCG Matrix.

    Input: list of dict, setiap dict berisi:
        - id_produk   : str
        - nama_produk : str
        - harga_jual  : float
        - harga_pokok : float
        - qty_terjual : int

    Output: dict berisi list hasil klasifikasi per produk
    """
    if not produk_list:
        return {"error": "List produk kosong"}

    _load_models()

    # Hitung margin_pct dari harga_jual dan harga_pokok
    hasil = []
    for p in produk_list:
        harga_jual  = float(p.get('harga_jual', 0))
        harga_pokok = float(p.get('harga_pokok', 0))

        if harga_jual <= 0:
            margin_pct = 0.0
        else:
            margin_pct = (harga_jual - harga_pokok) / harga_jual * 100

        qty_terjual = float(p.get('qty_terjual', 0))
        log_qty     = np.log1p(qty_terjual)

        # Scale dan predict
        X       = np.array([[margin_pct, log_qty]])
        X_scaled = _scaler.transform(X)
        cluster  = int(_kmeans.predict(X_scaled)[0])

        # Ambil kuadran dan rekomendasi dari mapping
        info = _mapping.get(str(cluster), {})

        hasil.append({
            "id_produk"   : p.get('id_produk', ''),
            "nama_produk" : p.get('nama_produk', ''),
            "margin_pct"  : round(margin_pct, 2),
            "qty_terjual" : int(qty_terjual),
            "cluster"     : cluster,
            "kuadran"     : info.get('kuadran', 'Unknown'),
            "rekomendasi" : info.get('rekomendasi', '-')
        })

    # Hitung ringkasan per kuadran
    ringkasan = {}
    for item in hasil:
        k = item['kuadran']
        ringkasan[k] = ringkasan.get(k, 0) + 1

    return {
        "total_produk" : len(hasil),
        "ringkasan"    : ringkasan,
        "produk"       : hasil
    }


if __name__ == '__main__':
    # Test dengan data contoh
    test_input = [
        {"id_produk": "PRD-001", "nama_produk": "Indomie Goreng",
         "harga_jual": 3500, "harga_pokok": 2700, "qty_terjual": 850},
        {"id_produk": "PRD-002", "nama_produk": "Beras 10kg",
         "harga_jual": 130000, "harga_pokok": 113000, "qty_terjual": 120},
        {"id_produk": "PRD-003", "nama_produk": "Sabun Mandi",
         "harga_jual": 5000, "harga_pokok": 3500, "qty_terjual": 45},
        {"id_produk": "PRD-004", "nama_produk": "Rokok GG",
         "harga_jual": 25000, "harga_pokok": 22500, "qty_terjual": 30},
    ]

    hasil = prediksi_bcg(test_input)
    print(f"Total produk: {hasil['total_produk']}")
    print(f"Ringkasan: {hasil['ringkasan']}")
    print()
    for p in hasil['produk']:
        print(f"  {p['nama_produk']:25s} -> {p['kuadran']:15s} | {p['rekomendasi']}")