# YAZGI Kültür Atölyesi — İlk entegrasyon

Ana menü, YAZGI'nın mevcut `index.html` dosyasındaki **yalnızca arayüz katmanına** eklenir. Simülasyon motoru `systems.js` ve event dosyaları değiştirilmedi; oyun kaydı aynı `yazgi_full_v1` anahtarında kalır. Sanat galerisi yalnızca `yazgi_culture_gallery_v1` anahtarına yazılır.

## Ekranlar
- **Ana menü:** `index.html` kök sayfası. "Yaşam Simülasyonuna Gir" mevcut oyunu açar; "Yeni Hayat" mevcut `openNew()` akışını kullanır; oyun içindeki "Ana Menü" düğmesiyle geri dönülebilir.
- **Portreyi Keşfet:** `kultur.html#discover`. Dairelere tıklama/dokunma, otomatik çözümleme, PNG indirme, özel fotoğraf ve tarihî portre/bayrak seçimi.
- **Yazıyla Sanat:** `kultur.html#calligram`. İstiklâl Marşı'nın tamamı veya özel metinle parlaklık temelli harf portresi; serbest harfle çizim, renk, yoğunluk, PNG ve yerel galeri.
- **Şehitlerimiz:** `kultur.html#memorial`. Saygı alanı; veri tabanı kopyası veya teyitsiz kişi bilgisi yoktur. Arşiv bağımsız siteye açılır.
- **Galeri:** `kultur.html#gallery`. Tarayıcının yerel depolamasında en fazla 8 küçültülmüş görüntü saklanır.

## Görsel kaynakları / hak kontrolü (güncel)

Görsel kaynakları Wikimedia Commons dosya sayfalarından seçildi; hata durumunda başka bir kişiye ait temsili çizim **gösterilmez**. Oyuncu kaynak bağlantısından doğru görseli kontrol edebilir veya kendi görselini yükleyebilir. Ağ üzerinden yüklenen görselleri Steam sürümünde çevrimdışı dağıtabilmek için görsel lisanslarının ve yargı alanlarının ayrıca doğrulanması gerekir.

### Tarihî portreler
- [Mustafa Kemal Atatürk, 1930 tarihli gerçek fotoğraf](https://commons.wikimedia.org/wiki/File:Portrait_photograph_of_Mustafa_Kemal_in_military_uniform_1930.jpg)
- [II. Mehmed (Fatih), Gentile Bellini'nin 1480 tarihli portresi](https://commons.wikimedia.org/wiki/File:Bellini,_Gentile_-_Portrait_of_Mehmed_II_-_National_Gallery,_London.jpg)
- [I. Selim (Yavuz), John Young'un 1815'te yayımladığı tarihî portre](https://commons.wikimedia.org/wiki/File:Selim_I_by_John_Young.jpg)
- [Şah İsmail I, Behzad'a atfedilen dönemiyle ilişkili portre detayı](https://commons.wikimedia.org/wiki/File:Shah_Ismail_I_Safavid,_Behzad_(portrait_detail).jpg)

**Not:** Atatürk bir fotoğraf; diğerleri sanatçıların tarihî portreleridir. Fotoğrafmış gibi sunulmamalı ve çizimlerin tarihî birebir doğruluk iddiası olmamalıdır.

### Bayraklar (eskiz değil, Wikimedia üzerinden alınan resmî tasarım görselleri)
- [Türkiye](https://commons.wikimedia.org/wiki/File:Flag_of_Turkey.svg)
- [Azerbaycan](https://commons.wikimedia.org/wiki/File:Flag_of_Azerbaijan.svg)
- [Kazakistan (sol süsleme, güneş, kartal)](https://commons.wikimedia.org/wiki/File:Flag_of_Kazakhstan.svg)
- [Kırgızistan (güncel bayrak)](https://commons.wikimedia.org/wiki/File:Flag_of_Kyrgyzstan.svg)
- [Özbekistan](https://commons.wikimedia.org/wiki/File:Flag_of_Uzbekistan.svg)

### Uygulama
- Portreyi Keşfet'te fare üzerinde gezince daireler bölünür, son nokta tamamlandığında katman kaldırılır ve net kaynak görseli gösterilir; HD PNG dışa aktarılır.
- Yazıyla Sanat artık sabit, yapay bir kafa/omuz kalıbı kullanmaz. Harflerin sınırı kaynak görüntünün zemin-özne kontrastından hesaplanır. Bu, her tarihî resimde aynı derecede güçlü çalışmayabilir.
- `yazgi_full_v1` kayıt anahtarı değişmez.
- Koalas to the Max ve Paint Toys kodu/arayüzü veya şehit arşivi kopyalanmaz; yalnız genel etkileşim fikri yorumlanır.

## Henüz yapılmadı
- Steam masaüstü paketi ve Steamworks entegrasyonu
- Çevrimdışı lisanslı görsel paketi ve tam içerik doğrulaması
- Farklı cihazlarda kapsamlı oynanış, erişilebilirlik ve performans testleri
- Kendi arşivimiz için yetkili veri sağlayıcıdan yazılı izin / doğrulanmış kayıtlar
