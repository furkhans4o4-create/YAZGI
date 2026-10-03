# Doğrulama — 1 Ekim 2026

## Otomatik kurallar

Komut: `node --test tests/systems.test.cjs`.

74 test tanımlı. Temel kapsam: çocuk yaşlarının tamamında yetişkin eylemlerini reddetme; tam 12 ay ve aynı ay kararı; 0–100 yaşta özgür/tutsak/sefer/sürgün bağlamlarında erişilebilir kart; uzmanlık ve tecrübe kapıları; tam sınır yaşta talim; üçüncü seçenek; kalıcı sefer çağrısı; tutsaklık/sefer eylem kısıtları; gerçek aile ve takvimle miras; eski kayıt yedeği ve göçü; ay içinde ölüm; ödenemeyen seçenek; NPC doğum ayı ve çocuk koşulları; mevsim/eylem/bilinmeyen önkoşul; bozuk kayıt koruma; 720 aylık geçiş; eski çocuk evliliğini partneri silmeden erteleme; karar sürerken takvim ayını koruma.

Testler gerçek uygulama betiklerini Node VM içinde çalıştırır. v6 ile yaşlılıkta vasiyet hazırlığı, ölüm kaydı ve seçilmiş varis sonrası kardeş gerilimi için dört ek regresyon testi bulunur. v7 ile değişken varlık fiyatı, hane geçim sıkıntısı, bakım/üretim kilidi ve kayıt göçü için dört ekonomi testi daha eklendi. v8 ile tutsaklık kamp profili, kaçış hazırlığı, kalıcı tutsaklık geçmişi, sürgünde barınma/erzak ve v7→v8 kayıt göçü için beş yeni regresyon testi eklendi. Minimal DOM, LocalStorage ve sabit tohumlu rastgelelik kullanır; bunlar görsel testin yerine geçmez. 720 aylık test, ölüm olduğunda yeni yaşam açarak ilerler; tek bir karakterin 720 ay hayatta kalacağını iddia etmez.

## Gerçek tarayıcı

Headless Chromium + Playwright ile doğrudan `index.html` açıldı. Masaüstü 1280×960 ve mobil 390×844 görünümü kontrol edildi.

- Karakter oluşturma ve bir aylık bakım eylemi.
- Sayfayı yeniledikten sonra aynı ayın kararının korunması.
- Fareyle gerçek pointer sürüklemesi ve klavye ok tuşuyla karar verme.
- Kararın ikinci bir ay harcamaması.
- Mobil yatay taşma kontrolü, kart ve görev ekranının görsel incelemesi.
- Sefer çağrısının yenilemede korunması ve reddedilince kapanması.
- Çalışma sırasında sıfır JavaScript sayfa hatası.

Kontrol ayrıca `node --check systems.js` ve `git diff --check` içerir. Bütün cihazlar veya bütün rastgele olay birleşimleri denenmiş değildir; koşul motorunun temel değişmezleri ve ana kullanıcı akışları doğrulanmıştır.
