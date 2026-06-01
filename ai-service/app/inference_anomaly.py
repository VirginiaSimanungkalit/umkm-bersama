import numpy as np
import pandas as pd
import joblib
import json
import os

BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

_models   = {}
_scalers  = {}
_metadata = None

def _load_models():
    global _models, _scalers, _metadata
    if _metadata is None:
        print("Loading Anomaly Detection models...")
        with open(os.path.join(MODELS_DIR, 'anomaly_metadata.json')) as f:
            _metadata = json.load(f)
        for kat in _metadata['kategori_list']:
            _models[kat]  = joblib.load(os.path.join(MODELS_DIR, f'iforest_{kat.lower()}.pkl'))
            _scalers[kat] = joblib.load(os.path.join(MODELS_DIR, f'scaler_anomaly_{kat.lower()}.pkl'))
        print("Anomaly models siap!")

def prediksi_anomaly(transaksi_list: list) -> dict:
    """
    Deteksi transaksi pengeluaran yang tidak wajar.

    Input: list of dict, setiap dict berisi:
        - id_transaksi      : str
        - kategori          : str  (HPP / Operasional / Overhead)
        - nominal           : float
        - hari_dalam_minggu : int  (0=Senin, 6=Minggu)
        - jam_encoded       : int  (jam transaksi, 0-23)
        - rolling_mean_7d   : float (rata-rata 7 hari sebelumnya, dihitung BE)
        - rasio_vs_baseline : float (nominal / rolling_mean_7d)

    Output: dict berisi hasil deteksi per transaksi
    """
    if not transaksi_list:
        return {"error": "List transaksi kosong"}

    _load_models()

    fitur     = _metadata['fitur_cols']
    threshold = _metadata['threshold']

    df_input = pd.DataFrame(transaksi_list)
    hasil    = []
    total_anomali = 0

    for kat in _metadata['kategori_list']:
        sub_idx = df_input[df_input['kategori'] == kat].index
        if len(sub_idx) == 0:
            continue

        X        = df_input.loc[sub_idx, fitur].fillna(0).values
        X_scaled = _scalers[kat].transform(X)
        scores   = _models[kat].decision_function(X_scaled)

        for i, idx in enumerate(sub_idx):
            row        = df_input.loc[idx]
            is_anomaly = int(scores[i] < threshold)
            total_anomali += is_anomaly

            # Buat pesan peringatan kalau anomali
            if is_anomaly:
                pesan = (
                    f"Pengeluaran {kat} sebesar "
                    f"Rp{row['nominal']:,.0f} terdeteksi tidak wajar. "
                    f"Rata-rata 7 hari terakhir: "
                    f"Rp{row['rolling_mean_7d']:,.0f}."
                )
            else:
                pesan = None

            hasil.append({
                "id_transaksi"  : row.get('id_transaksi', f'TRX-{idx}'),
                "kategori"      : kat,
                "nominal"       : float(row['nominal']),
                "anomaly_score" : round(float(scores[i]), 4),
                "is_anomaly"    : is_anomaly,
                "pesan_anomali" : pesan
            })

    return {
        "total_transaksi" : len(hasil),
        "total_anomali"   : total_anomali,
        "hasil"           : hasil
    }


if __name__ == '__main__':
    test_input = [
        {
            "id_transaksi": "TRX-001", "kategori": "HPP",
            "nominal": 250000, "hari_dalam_minggu": 0,
            "jam_encoded": 7, "rolling_mean_7d": 230000,
            "rasio_vs_baseline": 1.09
        },
        {
            "id_transaksi": "TRX-002", "kategori": "HPP",
            "nominal": 5000000, "hari_dalam_minggu": 3,
            "jam_encoded": 22, "rolling_mean_7d": 230000,
            "rasio_vs_baseline": 21.7
        },
        {
            "id_transaksi": "TRX-003", "kategori": "Operasional",
            "nominal": 45000, "hari_dalam_minggu": 1,
            "jam_encoded": 8, "rolling_mean_7d": 40000,
            "rasio_vs_baseline": 1.12
        },
        {
            "id_transaksi": "TRX-004", "kategori": "Overhead",
            "nominal": 500000, "hari_dalam_minggu": 0,
            "jam_encoded": 9, "rolling_mean_7d": 450000,
            "rasio_vs_baseline": 1.11
        },
    ]

    hasil = prediksi_anomaly(test_input)
    print(f"Total transaksi : {hasil['total_transaksi']}")
    print(f"Total anomali   : {hasil['total_anomali']}")
    print()
    for h in hasil['hasil']:
        status = "⚠️ ANOMALI" if h['is_anomaly'] else "✅ Normal"
        print(f"  {h['id_transaksi']} | {h['kategori']:12s} | "
              f"Rp{h['nominal']:>10,.0f} | {status}")
        if h['pesan_anomali']:
            print(f"    → {h['pesan_anomali']}")