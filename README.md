# YAZGI

İslamiyet öncesi Türk dünyasında geçen özgün PC yaşam simülasyonu.

## Şu an çalışan omurga
- 12 Hayvanlı Türk takvimi yıl döngüsü
- Her yaş/yıl için 12 aylık eylem hakkı
- Aile, kardeş, dost, rakip ve çocuk NPC'leri
- NPC yaşlanma, eş bulma, çocuk sahibi olma ve ölüm sistemi
- Yetişme: at biniciliği, okçuluk, demircilik, bitig, ozanlık
- Görev/kariyer yolları
- Sefer, yaralanma, ganimet, tutsaklık ve kaçış
- Evlilik ve soy devamı
- Varlıklar ve töre ihlalleri
- Yaşlılıkta aile meclisi, vasiyet hazırlığı ve son dilek
- Ölüm nedeni ve malvarlığı kaydı; eşit paylaşım veya ana varis
- Ölüm sonrası çocukla devam ve kardeşlerin mirasa uzun vadeli tepkileri
- Katmanlı karakter portresi: yüz yapısı, ten tonu, saç, saç rengi, sakal/bıyık ve başlık seçimi
- Yaşla kademeli ağarma ve yüz çizgileri; sağlık/kırılganlık, tutsaklık ve kalıcı yara izlerinin portreye yansıması; bakım geçmişi
- Kalıcı yetişme yolları: atlı yetişme, okçuluk, güreş, demircilik, bitig, söz/destan ve takas-kervan öğretimi
- Her yetişme yolunda gerçek usta ve akran NPC'leri, 6/18/36/60 aylık basamaklar, sınanmalar ve ileride görev kabulüne küçük eğitim avantajı
- Planlı göç ve yerleşim: aynı siyasi çevrede bölge değiştirme, uygun tarihte başka siyasi çevreye geçme, yalnız/ocakla/yakınlarla taşınma
- Yol masrafı ve riski, yeni yerde yerel bağ kurma, geride kalan yakınlarla uzaklık sonuçları ve göç geçmişi
- Yıllık amaçlar ve mevsimlik faaliyetler: her yıl farklı odak, ay/mevsime göre değişen uğraşlar
- Faaliyet geçmişi ve tekrar farkındalığı: farklı eylemler ödüllendirilir, aynı uğraşı art arda spamlamak cazibesini kaybeder
- Tutsaklıkta kamp düzeni: erzak, gözetim, kaçış hazırlığı, fidye desteği ve kalıcı tutsak yoldaşları
- Sürgünde barınak, erzak güveni, yerel bağlar ve arabuluculukla geri dönüş
- Mevsime ve kıtlığa göre değişen takas/pazar fiyatları
- Hane geçimi, varlık bakımı, sürü–demir ocağı–kervan için riskli üretim ve zarar
- Servet sınıfı ve son ekonomik hareketleri gösteren ekonomi özeti
- LocalStorage kayıt sistemi

## Çalıştırma
`index.html` doğrudan tarayıcıda açılabilir.

Bu repo artık YAZGI'nın ana deposudur.


## Event Motoru
- Yaş, durum, servet, itibar, aile, askerî geçmiş, sürgün ve tutsaklığa göre bağlamsal olay seçimi
- Ağırlıklı rastgele seçim, cooldown ve tek-seferlik olay desteği
- Çocukluk, yetişme, oba, sağlık, aile, ticaret, töre, devlet, sefer, tutsaklık ve yaşlılık olay havuzları
- Event seçimi aynı ayın içinde gerçekleşir; oyuncudan fazladan ay hakkı yemez

## APK araştırması ve YAZGI kuralları

[Tam sistem haritası ve tarihsel uyarlamalar](docs/SISTEM-HARITASI.md), [referans meslek koşulları](docs/REFERANS-MESLEKLER.md) ve [doğrulama raporu](docs/DOGRULAMA.md) repoda bulunur. Referans APK’lerin kodu, hikâyeleri, görselleri, sesleri veya arayüzleri oyuna alınmamıştır. Statik incelemede doğrulanamayan koşullar raporda açıkça ayrılır.

- **0–4 yaş:** aile/bakıcı kararları. **5–17:** yaşa uygun gözetimli yetişme. Evlilik, çocuk, sefer, suç ve bağımsız yatırım **18+**; mesleklerin ayrıca uzmanlık/tecrübe koşulları vardır.
- Her eylem **bir ay** harcar. Karar kartı aynı ayda çözülür; çözülmeden başka eylem yapılamaz. 12 karar tamamlanınca yeni yaşa geçilir.
- Kararlar sola/sağa sürüklenir; dokunma, ok tuşları ve yön düğmeleri desteklenir. Üçüncü seçenek kaybolmaz: sağ yön ile diğer alternatiflere geçilir.
- Sağlık/dinlenme, süreli rahatsızlık, görev tecrübesi, üretim, mülk takası, dost/rakip etkileşimi ve mal paylaşımı eklenmiştir.
- Kayıt bekleyen kartı, ayı ve hedef NPC’yi korur. Eski `yazgi_full_v1` kayıtları güncel sürüm 12’ye taşınır; sürüm değişiminde önce `yazgi_before_v12` yedeği alınır. Soy devamında gerçek aile, takvim yılı ve kalan aylar korunur.

### Dosyalar ve çalıştırma

`index.html` ile `systems.js` aynı klasörde bulunmalıdır. `index.html` tarayıcıda doğrudan açılır; paket kurulumu gerekmez. Veri/görünüm ve özgün olay zincirleri `index.html`, merkezi kurallar ve kayıt göçü `systems.js` içindedir. `docs/` altındaki referans inceleme dosyaları oyunun çalışma zamanı verisi değildir.

Testler Node.js'in yerleşik test çalıştırıcısını kullanır:

```sh
node --test tests/systems.test.cjs
```

Yeni eylemler `performAction` / `accessIssue` üzerinden çalışmalı; olaylar açık yaş ve koşul tanımı taşımalıdır. Meslek koşulları `CAREER_RULES` ile tek yerde tutulur. Bilinmeyen olay koşulları erişim vermez.
