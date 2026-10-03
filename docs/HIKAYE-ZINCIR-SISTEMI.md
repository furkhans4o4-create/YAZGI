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


## Sefer yoldaşlarının uzun hafızası

Sefer yoldaşları artık yalnızca aktif sefer ekranında görünen geçici NPC'ler değildir.

Bir yoldaşla savaş sırasında verilen karar şu sistemlere kalıcı veri bırakabilir:

- ilişki,
- güven,
- saygı,
- kin,
- yoldaşın kişisel itibarı,
- savaşta kurtarılıp bırakıldığına dair NPC hafızası,
- yıllar sonra geri dönecek gecikmeli eventler.

### Aynı kişiyle devam eden askerî zincir

Eski **military_comrade → night watch → small command → Tarkan** hattı artık ilk eventte seçilen gerçek sefer yoldaşına kilitlenir.

Örneğin Börü'yü savaşta kurtardıysan sonraki askerî kartlarda rastgele başka biri yerine Börü hikâyede kalabilir.

### Yoldaşlığın İzi

Askerî kariyer zincirinden ayrı olarak uzun vadeli bir sosyal hikâye eklendi:

1. Eski savaş kararı yıllar sonra yeniden gündeme gelir.
2. Bağı onarırsan eski yoldaş senden yardım isteyebilir.
3. Destek verirsen birkaç yıl sonra kendi statüsünde yükselir.
4. Yaşına ve itibarına bağlı olarak Alp, Tarkan veya Boy Beyi konumuna çıkabilir.
5. Eski hesabı yeniden açarsan ileride ihanet / husumet yolu oluşabilir.

Yoldaş oyuncunun desteğiyle yükselse bile oyuncunun eklentisi gibi davranmaz; kendi rolü, prestiji ve hafızası NPC üzerinde saklanır.

### Savaşta borcun geri dönmesi

Bir yoldaşı çatışmada kurtarmak, 2–7 yıl sonra yeni bir seferde tersine dönebilen bir sonuç bırakabilir.

Oyuncu gelecekte başka bir savaşta sıkıştığında aynı NPC geri dönüp onu kurtarabilir. Event yalnızca:

- gecikme süresi dolduysa,
- aynı NPC hâlâ hayattaysa,
- oyuncu tekrar aktif sefere çıktıysa

havuzda görünür.

### İhanet

Eski yoldaşlık kötü biçimde kapanırsa ileride NPC oyuncunun aleyhine konuşabilir. Oyuncu:

- bağı tamamen koparmadan yüzleşebilir,
- veya eski yoldaşı doğrudan hasım olarak işaretleyebilir.

İkinci durumda NPC gerçekten rakipler sistemine girer.

### Sefer sonuçlarının NPC'lere etkisi

Sefer bittiğinde yoldaşlar da sonuç yaşar:

- birlikte geçirilen sefer sayısı kaydedilir,
- itibar kazanabilirler,
- yaralanabilirler,
- nadiren çatışmada ölebilirler,
- başarılı seferler oyuncuyla güven / ilişkiyi güçlendirebilir.

Böylece sefer sonucu yalnızca oyuncunun servet ve sağlık değerini değiştirmez.

### Nesiller arası yoldaşlık

Oyuncu öldükten sonra güçlü bağı bulunan yaşayan eski yoldaşlar yeni nesilde **Aile dostu** olarak korunabilir.

En güçlü eski yoldaşlardan biri 1–4 yıl sonra yeni karakterin hayatına tekrar girebilir. Eski karakterle çıktığı seferleri anlatır ve yeni neslin:

- savaş becerisine,
- söz becerisine,
- genel tecrübesine,
- aile dostuyla ilişkisine

etki edebilir.

Bu sistemle tek bir savaş kararı potansiyel olarak oyuncunun kendi yetişkinlik döneminden çocuğunun hayatına kadar uzanabilir.


## Mesleklerin uzun kariyer hayatı

Meslek sistemi artık yalnızca "görevi seç → her ay birkaç servet kazan" yapısından çıkarıldı.

Her meslek için kalıcı bir profil tutulur:

- çalışılan ay sayısı,
- meslek itibarı,
- ustalık,
- toplam kazanç,
- başarılı iş sayısı,
- aksayan işler,
- en iyi çalışma serisi,
- geçmiş görev / giriş kayıtları.

Görev ekranında aktif mesleğin bu değerleri görünür. Aynı kişi başka bir role geçse bile eski meslek profilindeki ilerleme silinmez.

### Meslek çevresi NPC'leri

Meslek yollarının önemli bölümleri artık gerçek NPC'lere bağlıdır.

Örnek meslek kişileri:

- Demirci Ustası
- Bitig Ustası
- Kervanbaşı
- Ozan Ustası
- Pazar Ortağı

Bu kişiler normal NPC modelini kullanır; kişilik, ilişki, güven, saygı, kin, hafıza, yaş, sağlık ve kariyerleri vardır. Görev ekranındaki **Meslek Çevresi** bölümünde görülebilir ve oyuncu onlarla normal sosyal etkileşimler kurabilir.

Bir meslek hikâyesi hangi usta / ortak ile başladıysa sonraki eventler aynı NPC ile devam eder.

### Meslekte çalışmak

"Görevinde çalış" artık sabit +1 servet işlemi değildir.

Sonuç üzerinde:

- ilgili beceri seviyesi,
- mesleğin gerektirdiği seviye,
- sağlık,
- meslek itibarı,
- ustalık

etkilidir.

Başarılı aylarda kazanç, meslek itibarı, ustalık, beceri ve genel itibar artabilir. Arka arkaya başarılı işlerde karakterin meslekte adının duyulması hızlanır. Aksayan işlerde itibar düşebilir ancak tecrübe tamamen kaybolmaz.

## Genişletilmiş meslek hikâyeleri

### Demir Ocağının Yolu — 7 aşama

1. Bir ustanın yanında çıraklığa giriş
2. İlk ciddi hata
3. Ustanın yeterlilik sınavı
4. İlk gerçek müşteri siparişi
5. Kendi ocağı / bağımsız çalışma kararı
6. Rakip bir ocağın fiyat baskısı
7. Büyük sipariş / meslekte tanınma

İlk büyük işte verdiğin kalite-hız kararı 4–8 yıl sonra tekrar karşına çıkabilir. Eski işinin hâlâ kullanılması meslek itibarına ve ustalık geçmişine etki eder.

### Bitigden Elçiliğe — 7 aşamalı dallı yol

Yazıya girişten sonra kayıt tutma, hassas kayıtlar ve devlet hizmeti gelir.

Elçilik heyetine katılmayı seçersen diplomasi yolu devam eder. Merkezde kalmayı seçersen zincir **kayıtların sorumluluğunu üstlenen Bitigçi** yoluna dallanabilir. Böylece her seçim aynı kariyer finaline zorlanmaz.

Eski bir kayıt 4–9 yıl sonra yeni bir anlaşmazlıkla yeniden açılabilir.

### Kervan Yolu — 7 aşama

İlk yolculuk, geçit sorunu, pazar kararı, eksik yük hesabı, sermaye ortaklığı, rakip rota ve kervan yönetimine kadar uzanır.

Güvenli veya yeni rota kararı 3–7 yıl sonra bölgedeki diğer tüccarların kullandığı yolları etkileyen bir sonuç olarak geri gelebilir.

### Ozanın Sözü — 5 aşama

Ozanlık artık yalnızca bir görev adı değildir:

1. Ustanın yanında yetişme
2. İlk büyük toy
3. Başka bir ozanla söz rekabeti
4. Bir ileri gelenin koruyuculuk / armağan teklifi
5. Gençlere bırakılacak kendi anlatın

Karakter kendi anlatısını oluşturursa 5–10 yıl sonra sözlerinin başka gençler tarafından söylenmesi yeniden event olabilir.

### Pazarın Güveni — Tüccar kariyeri

Tüccar zinciri gerçek çalışma tecrübesi ister. Meslekte birkaç ay çalışmadan hikâye başlamaz.

Akışta:

- ilk kez fiyatları tek başına belirleme,
- veresiye / peşin satış kararı,
- eski borcun yıllar sonra geri dönmesi,
- pazarda isim kazanma,
- ortaklık veya bağımsız devam etme

vardır.

Bu sistemde "servet arttı" dışında pazar itibarı ve ustalık da kalıcıdır.

## Event motoru v2 geçişi

Daha önce oynanmış kayıtlar tamamen sıfırlanmaz. Story arc şeması ikinci sürüme yükseltildi. Eski event arşivleri yeniden okunarak mümkün olan kariyer zincirlerinin güncel aşaması oluşturulur.

Böylece daha önce Demirci / Bitig / Kervan zincirlerinin bir bölümünü oynamış kayıtların yeni genişletilmiş zincirlere mümkün olduğunca doğal biçimde devam etmesi hedeflenir.


## Boy meclisi, nüfuz ve beylik yükü

Devlet / boy kariyeri artık yalnızca **Bitigçi → Elçi → Boy Beyi** şeklinde düz bir görev listesi değildir.

Karakter için kalıcı bir boy-meclisi durumu tutulur:

- meclis nüfuzu,
- meclis güveni,
- oba desteği,
- rakip ileri gelenlerin baskısı,
- devam eden yükümlülükler,
- önemli karar geçmişi.

Bu değerler event seçimlerinden ve devlet görevinde geçirilen başarılı / başarısız aylardan etkilenir.

### Kalıcı devlet çevresi

Meclis hikâyesi başladığında üç kalıcı NPC oluşur:

- seni meclise sokan / destekleyebilen bir **Boy İleri Geleni**,
- kararlarına karşı çıkabilen bir **Rakip İleri Gelen**,
- gerilim yükseldiğinde devreye girebilen bir **Boy Büyüğü**.

Bunlar normal NPC sisteminin parçasıdır. Yaş, sağlık, kişilik, güven, saygı, kin ve hafızaları vardır. Meclis hikâyesi aynı destekçi ve aynı rakiple devam eder; kişiler ölürse ilgili uzun hikâye doğal biçimde kapanabilir.

## Boy Meclisinde Yükseliş — 6 aşama

1. Boy beyi / ileri gelen tarafından mecliste görüş vermeye çağrılma
2. Otlak anlaşmazlığında karar
3. Ortak katkı yükünün nasıl paylaşılacağı
4. Rakip ileri gelenin açık meydan okuması
5. Desteğin oba içinde mi yoksa meclisin güçlü isimleri arasında mı büyütüleceği
6. Yeterli yaş, beceri, devlet tecrübesi, itibar, meclis nüfuzu ve güven oluşursa Boy Beyi sorumluluğunun teklif edilmesi

Oyuncu son aşamada görevi kabul etmek zorunda değildir; mecliste etkili biri olarak kalmayı seçebilir.

Boy Beyi görevi artık yalnızca yüksek stat / beceri ile doğrudan açılamaz. Normal kariyer şartlarının yanında en az:

- 20 meclis nüfuzu,
- 30 meclis güveni

gerektirir.

Böylece yüksek becerili fakat boy çevresinde hiç ağırlık kazanmamış bir karakter tek tıkla Boy Beyi olamaz.

## Beyliğin Yükü — 5 aşama

Boy Beyi olduktan sonra ayrı bir yönetim hikâyesi başlar:

1. ilk büyük anlaşmazlık ve karar,
2. kış için ortak rezerv meselesi,
3. yakına ayrıcalık tanıyıp tanımama,
4. komşu toplulukla geçiş / otlak şartları,
5. 4–8 yıl sonra eski sınır kararının yeni kuşaklarla yeniden karşıya gelmesi.

Kararlar yalnız anlık stat değiştirmez. Örneğin sınır ve geçiş kararı yıllar sonra yeniden açılır; oyuncu eski kararını koruyabilir veya değişen koşullara göre yeniden düzenleyebilir.

Kış hazırlığı kararı da 2–4 yıl sonra tekrar tartışılabilir.

## Rakip baskısı

Rakip ileri gelen zaman içinde kendi etkisini artırabilir. Rakip baskısı yüksek seviyeye çıkarsa Boy Büyüğü oyuncuyu çekişmenin kararların önüne geçtiği konusunda uyarabilir.

Oyuncu:

- görüşme zemini arayıp baskıyı düşürebilir,
- veya geri adım atmayıp kendi nüfuzunu artırırken gerilimi büyütebilir.

Bu sistemin amacı devlet kariyerini yalnız "itibar sayısını yükselt" yapısından çıkarıp, aynı insanların ve eski kararların yıllar boyunca birbirini etkilediği bir sosyal yönetim simülasyonuna dönüştürmektir.

## Story arc v3

Boy-meclisi zinciri mevcut eski **bey_request** eventini başlangıç noktası olarak kullandığı için hikâye arşivi üçüncü şemaya yükseltildi.

v2 kayıtlar açılırken event arşivi tekrar okunur. Daha önce boy beyinden görüş isteme eventini yaşamış karakterler mümkün olduğu ölçüde yeni **Boy Meclisinde Yükseliş** zincirinin sonraki adımından devam eder.


## Kalıcı sağlık, yaralanma ve yaşlanma

Sağlık sistemi artık yalnızca tek bir **Sağlık** sayısının artıp azalmasına dayanmaz.

Her yaşam için kalıcı bir sağlık profili tutulur:

- aktif rahatsızlıklar,
- rahatsızlığın şiddeti ve kalan iyileşme süresi,
- kalıcı yara izleri,
- dayanıklılık,
- yaşla artan kırılganlık,
- dinlenmeye ayrılan aylar,
- otacı / bakım görüşmeleri,
- geçmiş sağlık krizleri ve iyileşmeler.

### Aktif rahatsızlıklar

Rahatsızlıklar kendi süre ve şiddetlerini taşır. Örnekler:

- ateşli rahatsızlık,
- soğukta güçten düşme,
- iyileşen yara,
- ağır yara,
- eklem ağrısı,
- eski yaranın sızısı,
- aşırı yorgunluk.

Her ay rahatsızlığın türü ve şiddetine göre sağlık kaybı oluşabilir. Dinlenme iyileşme süresini kısaltır; otacı bakımı hem süreyi hem şiddeti azaltabilir.

Bu, dönemin tıbbını kesin bir tarihsel model olarak sunmaz; oyundaki bakım / iyileşme kararlarını temsil eden soyut bir sistemdir.

### Kalıcı otacı NPC'si

Oyuncu bakım aradığında gerçek NPC sistemini kullanan bir **Otacı** karakter oluşabilir.

Otacının:

- adı,
- yaşı,
- kişiliği,
- oyuncuyla ilişkisi,
- güven ve saygısı,
- hafızası

kalıcıdır.

Oyuncu yıllar boyunca aynı kişiye tekrar gidebilir. Otacı ölürse sonraki bakım ihtiyacında yeni bir kişiyle tanışılabilir.

### İyileşme Yolu

İlk ciddi hastalık dönemlerinden biri dört aşamalı bir hikâyeye dönüşebilir:

1. rahatsızlığın uzaması,
2. otacıyla takip / dinlenme kararı,
3. gücün geri dönmeye başlaması,
4. iyileşme sonrasında bedenini nasıl koruyacağına dair karar.

Hikâye hangi otacıyla başladıysa aynı NPC ile devam eder.

### Sefer yaraları

Savaş yarası artık yalnızca **Sağlık -10** değildir.

Bir ağır sefer yarası:

- aktif bir ağır yara oluşturabilir,
- savaş yarası sayısını artırabilir,
- kalıcı iz bırakabilir,
- ağır talim ve fiziksel eylemleri iyileşene kadar kilitleyebilir.

Meydanda kalmayı seçmek daha fazla itibar getirebilir ancak yaranın şiddeti ve kalıcı izi daha ağır olabilir.

Sefer sonucu sırasında alınan yaralar da aynı sağlık motoruna bağlanmıştır.

### Eski yaranın yıllar sonra dönmesi

Kalıcı bir sefer yarası 8–18 yıl sonra tekrar kendini hatırlatabilir.

Bu gecikmiş event:

- aynı eski yaranın geçmişinden gelir,
- oyuncuya dinlenme veya otacı bakımı seçenekleri sunar,
- geçici **eski yaranın sızısı** rahatsızlığı oluşturabilir.

Yaş ilerledikçe kalıcı yaraların tekrar sorun çıkarma ihtimali de artar.

### Yaşlanma ve kırılganlık

45 yaş sonrasında yaş, düşük genel sağlık ve eski yara izleri karakterin **kırılganlık** değerini artırmaya başlar.

Kırılganlık:

- rahatsızlık dönemlerini daha ağır hale getirebilir,
- bazı ağır talimleri sınırlayabilir,
- yıllık ölüm riskine küçük fakat kalıcı bir katkı yapar.

Ölüm hesabı artık yalnız yaş ve anlık sağlık değerine bakmaz; aktif sağlık yükü ve kırılganlık da değerlendirilir.

### Eski kayıtların v5 geçişi

Save şeması sağlık sistemiyle birlikte **v5** oldu.

Eski kayıtlarda daha önce tutulmuş sefer yarası sayısı tamamen kaybolmaz. v5'e geçişte mevcut savaş yarası geçmişi mümkün olduğu ölçüde kalıcı yara izlerine dönüştürülür.

Geçiş öncesi kayıt ayrıca ayrı bir v5 öncesi yedek anahtarında korunur.
