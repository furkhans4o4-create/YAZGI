# YAZGI — Hikâye Zinciri / Story Arc Sistemi

Bu belge ikinci geliştirme aşamasının temelini açıklar.

Amaç: Bir eventin yalnızca "kart çıktı → stat değişti → bitti" şeklinde çalışmaması. Önemli olaylar yıllara yayılan, dallanan ve önceki kararları hatırlayan hikâye zincirlerine dönüşmelidir.

## Kalıcı arc durumu

Her aktif hikâye şu bilgileri saklar:

- hikâye kimliği,
- aktif / tamamlandı / yol kapandı durumu,
- kaçıncı aşamada olduğu,
- sıradaki event,
- başlangıç yaşı ve yılı,
- son event ve son seçim,
- varsa hikâyeye bağlı NPC kimlikleri,
- event ve seçim geçmişi.

Bu bilgiler save içinde saklanır.

## İlk tanımlı zincirler

Mevcut event havuzundaki büyük zincirler artık resmi story arc olarak takip edilir:

- Demir Ocağının Yolu
- Bitigden Elçiliğe
- Kervan Yolu
- Savaşçının Yükselişi
- Husumetin Sonu
- Ocağın İlk Yılları
- Büyük Sürünün Yolu
- Sürgün ve Dönüş
- Kişisel Husumet

## Sıradaki olay önceliği

Aktif bir hikâyenin beklenen sıradaki eventi, genel rastgele event havuzunda daha yüksek ağırlık alır. Böylece oyuncu bir zincire girdikten sonra hikâye onlarca yıl boyunca anlamsız biçimde kaybolmaz.

Buna rağmen eventin kendi koşulları korunur. Örneğin gereken yaş, beceri, servet veya itibar oluşmadıysa zincir bekler.

## Dallanma

Her event seçimi aynı sonraki adıma gitmek zorunda değildir.

Örnek:

Kişisel Husumet
1. Rakip seni küçümser.
2. Karşılık verirsen olay büyür; görmezden gelirsen hikâye burada bitebilir.
3. Olay büyürse beylerin önünde çözüm veya güç gösterisi yolu açılır.
4. Son aşamada barış veya kalıcı husumet seçilebilir.

Husumet zincirinde araya büyükleri sokma seçeneği de ayrı uzlaşma finaline bağlandı.

## Aynı NPC'yi takip etme

Bir hikâye belirli bir NPC ile başladıysa sonraki kartlarda rastgele başka NPC seçilmez.

Örneğin Kür adlı rakiple başlayan kişisel husumet zincirinin ikinci ve üçüncü eventleri de Kür ile devam eder. NPC ölürse veya artık uygun değilse hikâye başka bir kişiye aktarılmaz; ilgili hikâye yolu kapanır.

Bu davranış özellikle şu sistemler için temel olacaktır:

- rakiplik / dostluk,
- eş ve evlilik sorunları,
- çocuk yetiştirme,
- sefer yoldaşlığı,
- usta / çırak ilişkileri,
- boy siyaseti,
- aileler arası kan davası.

## Hayat ekranı

Aktif ve yakın zamanda biten önemli zincirler Hayat sekmesinde "Süren Hikâyeler" alanında görünür.

Gösterilen bilgiler:

- hikâye adı,
- aktif / tamamlandı / yol kapandı durumu,
- ilerleme,
- son karar.

Kart event sistemi değişmez; olay kararı yine tam ekran kararan sağa/sola swipe kartıyla verilir.

## Sürgün düzeltmesi

"Sürgün ve Dönüş" zincirinde oyuncu "Bir süre daha bekle" seçerse dönüş fırsatı artık sonsuza dek kaybolmaz. Event cooldown sonrasında tekrar gelebilir ve arc aktif kalır.

## Eski kayıtlar

Story arc durumu olmayan eski kayıtlar event arşivinden mümkün olduğu kadar yeniden oluşturulur. Yeni kayıtlar arc verisini doğrudan saklar.

## İkinci aşamada sıradaki işler

Bu temel üzerinde yapılacak sonraki çalışmalar:

- daha fazla dinamik NPC merkezli zincir,
- aile / evlilik / çocuk zincirlerinin 3–5 aşamalı hale gelmesi,
- mesleklerin özel olay zincirlerinin büyütülmesi,
- sefer yoldaşlarının yıllar sonra geri dönmesi,
- kararların 5–20 yıl sonra yeniden sonuç üretmesi,
- aynı olayın farklı kişilik ve geçmişe göre farklı metin / seçenek üretmesi,
- zincir sonuçlarının miras, kariyer, servet ve devlet sistemlerini değiştirmesi.

İkinci aşamanın kalite ölçütü event sayısı değil, bir kararın kaç yıl ve kaç başka sistem boyunca anlamlı kalabildiğidir.


## Gecikmeli sonuç motoru

İkinci aşamanın yeni temel parçası olarak kararların yıllar sonra geri dönmesini sağlayan kalıcı bir gecikmeli event kuyruğu eklendi.

Bir seçim artık geleceğe şu bilgileri bırakabilir:

- hangi eventin geri döneceği,
- kaç yıl sonra döneceği,
- hangi NPC'ye bağlı olduğu,
- ikinci bir NPC varsa onun kimliği,
- olayı doğuran eski event,
- gelecekte kullanılacak yol / açıklama verisi.

Gecikmiş event zamanı gelmeden normal event havuzuna girmez. Bağlı NPC ölürse sonuç başka bir kişiye aktarılmaz. Event çözüldüğünde kuyruk kaydı kapatılır.

Kart üzerinde seçim gelecekte sonuç doğuracaksa oyuncuya örneğin **"5–9 yıl sonra sonuç doğurabilir"** bilgisi gösterilir.

## Ocağın Yılları

Evlilik sonrası kısa iki eventlik yapı beş aşamalı kalıcı bir hikâyeye dönüştürüldü.

Akış:

1. İlk zor kış
2. Eşin ailesinin yardım talebi
3. Ocağın iş yükünün paylaşılması
4. Eşler arasında güven ve ortak karar sınavı
5. 4–8 yıl sonra eski kararın yeniden hatırlanması

Zincir başladığı eşe kilitlenir. Sonraki kartlarda rastgele başka eş / NPC kullanılmaz. Eş yaşamını yitirirse zincir doğal biçimde kapanır.

## Bir Çocuğun Yolu

Çocuk yetiştirme artık tek seferlik stat seçimi değildir.

Akış:

1. Çocuğun ilk yetişme yönü seçilir: at-ok, zanaat veya serbest yol.
2. Çocuk büyüdükçe kendi isteğini dile getirir.
3. Oba dışındaki yaşam yolu için aileyle yeni bir karar verilir.
4. Son karar 5–9 yıl sonra gerçek bir kariyer / yaşam sonucu olarak geri döner.

Hikâye tek bir çocuğa kilitlenir. Çocuğa verilen eski yönlendirme NPC'nin kendi durumunda saklanır ve sonraki event metninde hatırlanır.

Gecikmiş final geldiğinde seçilen yola göre NPC'nin becerileri, amacı, mesleği, itibar / ilişki hafızası güncellenir. Örneğin zanaat yolu yıllar sonra gerçekten Demirci gibi bir role dönüşebilir.

Bu sistemin amacı çocukların oyuncunun ekranındaki pasif isimler olarak kalmaması; çocuklukta verilen kararların yetişkin hayatlarında gözle görülür sonuç üretmesidir.
