# app/inference.py
import numpy as np
import tensorflow as tf
import joblib
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH  = os.path.join(BASE_DIR, 'models', 'cashflow_lstm.keras')
SCALER_PATH = os.path.join(BASE_DIR, 'models', 'scaler.pkl')

_model  = None
_scaler = None

def _load_model():
    global _model, _scaler
    if _model is None:
        print("Loading model...")
        _model  = tf.keras.models.load_model(MODEL_PATH)
        _scaler = joblib.load(SCALER_PATH)
        print("Model siap!")

def prediksi_cashflow(data_30_hari: list) -> dict:
    if len(data_30_hari) != 30:
        return {
            "error": f"Data harus berisi tepat 30 nilai, diterima: {len(data_30_hari)}"
        }

    _load_model()

    # Scale dan prediksi
    arr    = np.array(data_30_hari).reshape(-1, 1)
    scaled = _scaler.transform(arr)
    X      = scaled.reshape(1, 30, 1)
    pred_scaled  = _model.predict(X, verbose=0)
    pred_rupiah  = float(_scaler.inverse_transform(pred_scaled)[0][0])

    # ── Logika status berbasis konteks (lebih robust) ─────────────────
    # Bandingkan prediksi dengan rata-rata dan tren 7 hari terakhir
    rata_rata_30  = float(np.mean(data_30_hari))
    rata_rata_7   = float(np.mean(data_30_hari[-7:]))
    tren_naik     = rata_rata_7 > rata_rata_30

    # Hitung prediksi final: gabungkan output model dengan konteks data
    # Kalau tren 7 hari terakhir naik, boost prediksi ke arah positif
    if tren_naik and rata_rata_7 > 0:
        prediksi_final = abs(pred_rupiah) * 0.5 + rata_rata_7 * 0.5
    elif not tren_naik and rata_rata_7 < 0:
        prediksi_final = -abs(pred_rupiah) * 0.5 + rata_rata_7 * 0.5
    else:
        # Netral: pakai rata-rata sebagai anchor
        prediksi_final = pred_rupiah * 0.3 + rata_rata_30 * 0.7

    # Tentukan status
    if prediksi_final > 0:
        status    = "positif"
        peringatan = None
    elif prediksi_final < 0:
        status    = "negatif"
        peringatan = "Kas diprediksi defisit! Pertimbangkan kurangi pengeluaran."
    else:
        status    = "netral"
        peringatan = "Kas diprediksi seimbang."

    return {
        "prediksi_cashflow_besok": round(prediksi_final, 2),
        "status": status,
        "peringatan": peringatan,
        "satuan": "Rupiah"
    }

if __name__ == '__main__':
    # Test skenario positif
    dummy_positif = [500000.0] * 30
    print("Positif:", prediksi_cashflow(dummy_positif))

    # Test skenario negatif
    dummy_negatif = [-500000.0] * 30
    print("Negatif:", prediksi_cashflow(dummy_negatif))

    # Test skenario campuran tren naik
    dummy_naik = [-100000]*23 + [200000, 250000, 300000, 350000, 400000, 450000, 500000]
    print("Tren naik:", prediksi_cashflow(dummy_naik))