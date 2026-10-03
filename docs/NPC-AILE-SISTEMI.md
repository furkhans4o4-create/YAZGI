# YAZGI — NPC ve Aile Sistemi

Bu belge YAZGI'nın birinci derinleştirme aşamasındaki NPC/aile mimarisini açıklar. Amaç, NPC'lerin yalnızca bir isim ve ilişki çubuğu olmaması; yıllar içinde değişen, seçimleri hatırlayan ve oyuncunun soy hikâyesine kalıcı iz bırakan kişiler olmasıdır.

## NPC veri modeli

Her NPC artık şu katmanlara sahiptir:

- Kimlik: kalıcı `id`, ad, yaş, cinsiyet, yakınlık türü, doğum yılı/ayı, köken ve boy.
- Yaşam: sağlık, hayatta/ölü durumu, görev/meslek, görev geçmişi, kişisel servet ve itibar.
- Kişilik: iki kalıcı karakter özelliği. Örnekler: Sadık, Hırslı, Gururlu, Cömert, Tutumlu, Kinci, Bağışlayıcı, Cesur, Temkinli, Merhametli, Kuşkucu, Konuşkan, Çalışkan, Sakin.
- Amaç: aile, servet, itibar, ustalık, sefer, bilgelik veya sakin yaşam eksenlerinden biri.
- Bağlar: genel ilişki değerine ek olarak güven, saygı, çekince ve kin.
- Hafıza: NPC'nin oyuncuyla ve kendi hayatıyla ilgili son önemli anıları. Hafıza kayıtları tür, metin, ağırlık, yaş ve yıl bilgisi taşır.
- Soy: ebeveyn kimlikleri, eş, çocuk sayısı ve alt soy.

Eski kayıtlar açıldığında yeni alanlar otomatik oluşturulur. Kayıt şeması v3'tür ve eski kayıt yüklenmeden önce yedeklenir.

## Geniş aile

Yeni yaşam doğduğunda çekirdek aileye ek olarak mümkün olduğunda:

- dede ve nineler,
- amca/hala,
- dayı/teyze,
- kuzenler

oluşturulur. Bu kişiler yalnız dekor değildir; yaşlanır, meslek değiştirir, evlenebilir, çocuk sahibi olabilir, sağlık kaybedebilir ve ölebilir.

Soydan yeni karaktere geçildiğinde eski ana/ata artık yeni karakterin dede/ninesi haline gelir; eski kardeş kuşağı amca/dayı/hala/teyze halkasına aktarılır. Böylece nesil değişince aile ağı sıfırlanmaz.

## İlişki katmanları

`rel` genel yakınlığı gösterir fakat kararlar artık yalnız bu sayıya bağlı değildir.

- Güven: sır paylaşma, yardım, sadakat ve uzun süreli destekten etkilenir.
- Saygı: birlikte çalışma, öğüt dinleme, toplumsal konum ve bazı kişiliklerden etkilenir.
- Kin: kırıcı seçimler, reddedilen yardım veya eski düşmanlıklardan doğar. Bağışlayıcı kişilerde daha hızlı azalır, kinci kişilerde daha kalıcıdır.
- Çekince: gelecekte tehdit, otorite ve korku tabanlı ilişkilerde kullanılmak üzere saklanır.

Aile kartlarında bu değerler görünür.

## Etkileşimler

NPC kartlarından yaş ve koşula göre şu eylemler yapılabilir:

- Vakit geçir
- Dertleş
- Yardım et
- Birlikte çalış
- Armağan ver
- Öğüt al
- Rakiple uzlaş

Her eylem kişiliğe göre farklı ağırlıkta sonuç üretir. Örneğin sadık bir NPC güvene daha güçlü tepki verebilir; bağışlayıcı bir rakibin kini daha hızlı azalabilir. Etkileşimler NPC hafızasına kayıt bırakır ve yıllar sonra ilişki değişiminde kullanılabilir.

Sefer yoldaşları da aynı NPC modeline bağlanmıştır. Sefer sırasında yalnız yoldaşlarla sosyal etkileşim yapılabilir; böylece sefer arkadaşlığı sonraki yaşam yıllarında gerçek bir bağ olarak korunabilir.

## Otonom NPC yaşamı

Her yıl NPC yaşam döngüsü çalışır:

- yaş ve doğum tarihi güncellenir,
- çocukluk/yetişme/yetişkinlik görevleri kişisel hedefe göre değişebilir,
- hırslı kişiler zamanla görev değiştirebilir,
- servet/itibar/ustalık hedefleri ilgili kişisel değerleri etkileyebilir,
- uzun süre görüşülmeyen bazı ilişkiler zayıflayabilir,
- güven ve kin yıllar içinde farklı hızlarda değişebilir,
- eş bulma ihtimali kişisel amaca göre değişir,
- eşli NPC'ler çocuk sahibi olabilir,
- yaş ve sağlık ölüm riskini etkiler.

Yakın ailedeki büyük değişiklikler yaşam günlüğüne yazılır; uzak akrabalardaki her küçük değişiklik günlüğü spamlamaz.

## Hedefli event sistemi

Eventler artık belirli bir NPC'yi hedefleyebilir. Desteklenen hedef havuzları arasında çocuk, yetiştirilebilir çocuk, dost, rakip, ana/ata, kardeş, geniş akraba, yakın aile ve güvenilen kişi bulunur.

Bir event belirli türde hedef gerektiriyorsa uygun yaşayan NPC yokken event havuza girmez. Kartta hedef kişinin adı görünür.

İlk sosyal event örnekleri:

- bir yakının yardım istemesi,
- güvenilen bir kişinin sır paylaşması,
- rakibin barış görüşmesi teklif etmesi,
- kardeşin yaşam yolu hakkında fikir istemesi.

Kart seçimleri oyuncu statlarının yanında hedef NPC'nin ilişki, güven, saygı ve kin değerlerini de gösterebilir. Sonuç NPC hafızasına kalıcı olarak yazılır.

## Tasarım ilkesi

Bir NPC ile bugün verilen karar mümkün olduğunca yalnız o ayın stat değişimi olarak kalmamalıdır. Hedef, ilerleyen geliştirmelerde bu hafıza ve bağ verilerini:

- miras tartışmaları,
- evlilik ittifakları,
- seferde yardım/ihanet,
- boy siyaseti,
- görev tavsiyesi,
- kan davası ve barış,
- çocuk yetiştirme,
- yaşlılıkta bakım

gibi uzun zincirlere bağlamaktır.

NPC ve aile sistemi diğer büyük sistemlerin taşıyıcı katmanı olarak ele alınır; yeni özellikler bu modeli atlayarak ayrı birer mini oyun şeklinde eklenmemelidir.


## Birinci aşama durumu

NPC + Aile aşaması tamamlandı.

Bu aşamanın kapanışında NPC'ler artık yalnızca oyuncuyla değil birbirleriyle de kalıcı bağ kurabiliyor. Akrabalık, eş bağı, yoldaşlık, dostluk ve husumet sosyal ağda saklanıyor; kişilikler bu bağların yıllık değişimini etkiliyor. Yakın bir aile üyesinin başka bir NPC ile dost veya hasım olması oyuncunun hayatına geri dönebiliyor.

Soydan çocukla devam edildiğinde eski karakterin güçlü dostları ve yakın yoldaşları **Aile dostu**, yaşayan rakipleri ise **Aile hasmı** olarak yeni nesle taşınabiliyor. Bu bağlantılar yeni nesilde event üretmeye devam ediyor.

Aile ekranında NPC'lerin kendi güçlü bağları ve yakınların birbirleriyle ilişkileri görülebiliyor. Kayıt şeması v4'e yükseltildi ve eski kayıtlar için geçiş katmanı korunuyor.

Bundan sonraki büyük geliştirmeler NPC çekirdeğini tekrar kurmak yerine bu çekirdeği kullanmalıdır.
