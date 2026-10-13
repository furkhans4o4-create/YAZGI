# YAZGI Kültür Atölyesi — İlk entegrasyon

Ana menü, YAZGI'nın mevcut `index.html` dosyasındaki **yalnızca arayüz katmanına** eklenir. Simülasyon motoru `systems.js` ve event dosyaları değiştirilmedi; oyun kaydı aynı `yazgi_full_v1` anahtarında kalır. Sanat galerisi yalnızca `yazgi_culture_gallery_v1` anahtarına yazılır.

## Ekranlar
- **Ana menü:** `index.html` kök sayfası. "Yaşam Simülasyonuna Gir" mevcut oyunu açar; "Yeni Hayat" mevcut `openNew()` akışını kullanır; oyun içindeki "Ana Menü" düğmesiyle geri dönülebilir.
- **Portreyi Keşfet:** `kultur.html#discover`. Dairelere tıklama/dokunma, otomatik çözümleme, PNG indirme, özel fotoğraf ve tarihî portre/bayrak seçimi.
- **Yazıyla Sanat:** `kultur.html#calligram`. İstiklâl Marşı'nın tamamı veya özel metinle parlaklık temelli harf portresi; serbest harfle çizim, renk, yoğunluk, PNG ve yerel galeri.
- **Şehitlerimiz:** `kultur.html#memorial`. Saygı alanı; veri tabanı kopyası veya teyitsiz kişi bilgisi yoktur. Arşiv bağımsız siteye açılır.
- **Galeri:** `kultur.html#gallery`. Tarayıcının yerel depolamasında en fazla 8 küçültülmüş görüntü saklanır.

## Görsel kaynakları / hak kontrolü
Tarihî portre görselleri Wikimedia Commons üzerinden **canlı** yüklenir, yükleme başarısızsa kullanıcıya örnek çizim ve kendi fotoğrafını yükleme sunulur. Steam'e paketlemeden önce kaynakların lisans sayfalarını tek tek inceleyip uygun fotoğraf dosyalarını çevrimdışı dağıtıma hazırlayın:
- [Atatürk askerî portre fotoğrafı (1930)](https://commons.wikimedia.org/wiki/File:Portrait_photograph_of_Mustafa_Kemal_in_military_uniform_1930.jpg)
- [Gentile Bellini — II. Mehmed portresi](https://commons.wikimedia.org/wiki/File:Bellini,_Gentile_-_Portrait_of_Mehmed_II_-_National_Gallery,_London.jpg)
- [John Young — I. Selim portresi](https://commons.wikimedia.org/wiki/File:Selim_I_by_John_Young.jpg)
- [Şah İsmail portresi, Çehel Sütun (yaklaşık 1647; ölümünden sonra yapılmış)](https://commons.wikimedia.org/wiki/File:Shah_Ismail_I_portrait,_Chehel_Sotoun,_painted_circa_1647.jpg)

**Kaynak gösterimi, lisans denetiminin yerini tutmaz.** Bayraklar özgün Canvas çizimleridir; bu prototipin basitleştirilmiş temsilleri resmî bayrak ölçülerine göre son sürümde doğrulanmalıdır. Koalas to the Max, Paint Toys ve sehitlerimiz.org.tr kodu/içeriği kopyalanmamıştır. Sadece genel etkileşim ilkelerinden esinlenilmiştir.

## Henüz yapılmadı
- Steam masaüstü paketi ve Steamworks entegrasyonu
- Çevrimdışı lisanslı görsel paketi ve tam içerik doğrulaması
- Farklı cihazlarda kapsamlı oynanış, erişilebilirlik ve performans testleri
- Kendi arşivimiz için yetkili veri sağlayıcıdan yazılı izin / doğrulanmış kayıtlar
