# app/inference_advisory.py
# Advisory Layer: menggabungkan output cashflow + BCG menjadi rekomendasi bisnis

def generate_advisory(cashflow_result: dict, bcg_result: dict) -> dict:
    """
    Gabungkan hasil prediksi cashflow dan BCG Matrix
    menjadi rekomendasi bisnis otomatis.

    Parameters:
        cashflow_result : output dari prediksi_cashflow()
        bcg_result      : output dari prediksi_bcg()

    Returns:
        dict berisi rekomendasi lengkap
    """
    rekomendasi = []
    prioritas   = "normal"

    # ── Analisis Cash Flow ────────────────────────────────────────────
    prediksi    = cashflow_result.get('prediksi_cashflow_besok', 0)
    status_kas  = cashflow_result.get('status', 'netral')
    peringatan  = cashflow_result.get('peringatan')

    if status_kas == 'negatif':
        prioritas = "tinggi"
        rekomendasi.append(
            f"⚠️ Kas diprediksi defisit sebesar "
            f"Rp {abs(prediksi):,.0f}. "
            f"Segera kurangi pengeluaran tidak perlu."
        )
    elif status_kas == 'positif':
        rekomendasi.append(
            f"✅ Kas diprediksi positif sebesar "
            f"Rp {prediksi:,.0f}. "
            f"Kondisi keuangan warung sehat."
        )
    else:
        rekomendasi.append("📊 Kas diprediksi seimbang. Pantau pengeluaran harian.")

    # ── Analisis BCG Matrix ───────────────────────────────────────────
    produk_list = bcg_result.get('produk', [])
    ringkasan   = bcg_result.get('ringkasan', {})

    # Hitung per kuadran
    star_list   = [p for p in produk_list if p['kuadran'] == 'Star']
    dog_list    = [p for p in produk_list if p['kuadran'] == 'Dog']
    cow_list    = [p for p in produk_list if p['kuadran'] == 'Cash Cow']
    qm_list     = [p for p in produk_list if p['kuadran'] == 'Question Mark']

    # Rekomendasi Star
    if star_list:
        nama_star = ', '.join([p['nama_produk'] for p in star_list[:3]])
        rekomendasi.append(
            f"⭐ Produk unggulan (Star): {nama_star}. "
            f"Pertahankan stok dan prioritaskan display."
        )

    # Rekomendasi Dog — lebih mendesak kalau kas negatif
    if dog_list:
        nama_dog = ', '.join([p['nama_produk'] for p in dog_list[:3]])
        if status_kas == 'negatif':
            prioritas = "tinggi"
            rekomendasi.append(
                f"🔴 Ada {len(dog_list)} produk Dog: {nama_dog}. "
                f"Kurangi stok segera untuk hemat modal karena kas sedang defisit."
            )
        else:
            rekomendasi.append(
                f"🔴 Ada {len(dog_list)} produk Dog: {nama_dog}. "
                f"Pertimbangkan kurangi stok atau hapus dari katalog."
            )

    # Rekomendasi Cash Cow
    if cow_list:
        nama_cow = ', '.join([p['nama_produk'] for p in cow_list[:3]])
        rekomendasi.append(
            f"🟢 Produk Cash Cow: {nama_cow}. "
            f"Tingkatkan promosi untuk mendorong volume penjualan."
        )

    # Rekomendasi Question Mark
    if qm_list:
        nama_qm = ', '.join([p['nama_produk'] for p in qm_list[:3]])
        rekomendasi.append(
            f"🟡 Produk Question Mark: {nama_qm}. "
            f"Evaluasi harga atau strategi penjualan."
        )

    # ── Saran Green Financing ─────────────────────────────────────────
    if status_kas == 'positif' and prediksi > 500000:
        rekomendasi.append(
            "💡 Saran Green Financing: Kas surplus cukup besar. "
            "Pertimbangkan investasi ke produk ramah lingkungan "
            "atau tabung untuk modal bulan depan."
        )

    return {
        "prioritas"    : prioritas,
        "status_kas"   : status_kas,
        "prediksi_kas" : round(prediksi, 2),
        "rekomendasi"  : rekomendasi,
        "ringkasan_bcg": ringkasan,
        "total_produk" : len(produk_list)
    }


if __name__ == '__main__':
    # Test dengan data dummy
    cashflow_dummy = {
        "prediksi_cashflow_besok": -50000.0,
        "status": "negatif",
        "peringatan": "Kas diprediksi defisit!",
        "satuan": "Rupiah"
    }

    bcg_dummy = {
        "total_produk": 4,
        "ringkasan": {"Star": 1, "Dog": 2, "Cash Cow": 1},
        "produk": [
            {"nama_produk": "Indomie Goreng", "kuadran": "Star",     "rekomendasi": "Pertahankan stok."},
            {"nama_produk": "Beras 10kg",     "kuadran": "Dog",      "rekomendasi": "Kurangi stok."},
            {"nama_produk": "Rokok GG",       "kuadran": "Dog",      "rekomendasi": "Kurangi stok."},
            {"nama_produk": "Sabun Mandi",    "kuadran": "Cash Cow", "rekomendasi": "Tingkatkan promosi."},
        ]
    }

    hasil = generate_advisory(cashflow_dummy, bcg_dummy)
    print(f"Prioritas: {hasil['prioritas']}")
    print(f"Status kas: {hasil['status_kas']}")
    print()
    print("Rekomendasi:")
    for r in hasil['rekomendasi']:
        print(f"  {r}")