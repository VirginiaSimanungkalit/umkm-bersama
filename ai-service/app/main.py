# app/main.py
# FastAPI - pintu masuk semua request AI

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import sys
import os

# Tambahkan root folder ke path supaya bisa import inference.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.inference import prediksi_cashflow

# ── Inisialisasi FastAPI ──────────────────────────────────────────────
app = FastAPI(
    title="UMKM Bersama - AI Service",
    description="API untuk Cash Flow Forecasting, Anomaly Detection, dan BCG Matrix",
    version="1.0.0"
)

# ── Schema request & response ─────────────────────────────────────────
# Pydantic memastikan data yang masuk sesuai format yang diharapkan
class ForecastRequest(BaseModel):
    data_30_hari: list[float]

    class Config:
        json_schema_extra = {
            "example": {
                "data_30_hari": [50000.0] * 30
            }
        }

class ForecastResponse(BaseModel):
    prediksi_cashflow_besok: float
    status: str
    peringatan: Optional[str]
    satuan: str

# ── Endpoints ─────────────────────────────────────────────────────────

@app.get("/")
def root():
    """Cek apakah API berjalan."""
    return {
        "message": "UMKM Bersama AI Service berjalan!",
        "status": "ok",
        "endpoints": [
            "/api/ai/cashflow-forecast",
            "/health"
        ]
    }

@app.get("/health")
def health_check():
    """Health check untuk monitoring."""
    return {"status": "ok", "service": "AI Service"}

@app.post("/api/ai/cashflow-forecast", response_model=ForecastResponse)
def forecast_cashflow(request: ForecastRequest):
    """
    Prediksi net cash flow untuk hari berikutnya.
    
    Input: 30 nilai net cash flow harian dalam Rupiah
    Output: prediksi cash flow besok + status + peringatan
    """
    # Validasi jumlah data
    if len(request.data_30_hari) != 30:
        raise HTTPException(
            status_code=400,
            detail=f"data_30_hari harus berisi tepat 30 nilai, diterima: {len(request.data_30_hari)}"
        )
    
    # Panggil fungsi prediksi dari inference.py
    hasil = prediksi_cashflow(request.data_30_hari)
    
    # Kalau inference.py return error
    if "error" in hasil:
        raise HTTPException(status_code=500, detail=hasil["error"])
    
    return hasil