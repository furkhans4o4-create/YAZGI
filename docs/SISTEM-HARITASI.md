# APK sistem haritası ve YAZGI uyarlaması

İnceleme tarihi: 1 Ekim 2026. Başlangıç repo sürümü: `49302ff`. Mevcut `index.html` ve README bütünüyle incelendi; dönemler, takvim, kariyerler, olay zincirleri, aile, soy, varlıklar ve mevcut kayıt anahtarı temel alındı.

Bu çalışma referanslardan **oyun mimarisi, veri ilişkileri ve koşul türleri** çıkarır. Referans uygulamaların kodu, hikâyeleri, arayüzü, görselleri, sesleri veya paketleri YAZGI’ya eklenmedi. Eklerdeki sınıf/alan adları, meslek tanımları ve sayısal koşullar analiz kanıtıdır; oyun bu dosyaları yüklemez.

## Kanıt düzeyi ve sınırlar

- **Veriden doğrulandı:** çözümlenmiş bir tabloda bulunan sayısal değer veya alan.
- **Yapıdan doğrulandı:** metadata, Dart paket yolu, serileştirme sembolü veya bundle nesne türü. Sistemin varlığını gösterir; tek başına çalışma zamanındaki bütün koşulları göstermez.
- **YAZGI tasarımı:** tarihsel ortam için burada belirlenen oyun kuralı. Referansın yaşı veya tarihsel bir yasa olduğu iddia edilmez.
- **Bilinmiyor:** native fonksiyon gövdesine, sunucuya veya çalışma zamanı doğrulamasına ihtiyaç duyan koşullar.

İncelenen BitLife dosyasının adı modlu dağıtıma işaret ediyor. Bulgular bu dosyanın içeriğine aittir; resmî sürümün tüm davranışlarına genellenemez. APK’lar çalıştırılmadı. Statik tarama, erişilebilir dosyalar ve modeller için kapsamlıdır; bütün native dalların ve sunucu kurallarının eksiksiz çıkarıldığı iddia edilmez. Özellikle TC Simülasyonu’nun sayısal minimum yaşları AOT sembollerinden elde edilemedi. Bilinmeyen bir yaş “0” veya “serbest” olarak yorumlanmadı.

## Paket ve içerik organizasyonu

| Referans | Doğrulanan mimari | Çıkarılan yapı |
|---|---|---|
| BitLife 3.25.1 dosyası | Unity, ARM64 IL2CPP, metadata sürümü 39 | `libil2cpp.so`, `global-metadata.dat`, Assembly-CSharp izleri; 2.755 `Scenario*` tip adı |
| `data.unity3d` | Unity çalışma zamanı/içerik nesneleri | 7.854 MonoScript, 1.726 MonoBehaviour, 154 Texture2D, 130 Sprite, 418 AudioClip; animasyon, font, video ve Canvas nesneleri |
| `datapack.unity3d` | Paketlenmiş içerik/veri | 1.086 TextAsset, 8.133 Texture2D, 8.094 Sprite, 17 AudioClip; prefab/arayüz nesneleri |
| BitLife tabloları | 967 `-enc` adlı TextAsset; Base64 ve tekrarlı XOR katmanı | En az iki sütun ve bir veri satırı filtresiyle 954 tablo, 84.555 satır. Bunlar ad listeleri ve yardımcı/test verileri de içerir; **olay sayısı değildir** |
| TC Simülasyonu 1.0.134 | APKS içinde base ve mimari/dil/yoğunluk split’leri; Flutter/Dart AOT | `libapp.so`, `libflutter.so`, `flutter_assets`; 638 uygulamaya ait paket yolu |
| TC içeriği | Görsel, ses, font, manifest, lisans/yardımcı veriler | base.apk: 3.261 küçük harfli `.png`, 179 `.jpg`, 116 `.svg`, 85 `.mp3`, 4 `.wav`; diğer uzantılar envanter ekinde |

Sayılar nesne/satır sayısıdır; benzersiz hikâye veya kullanıma açık özellik sayısı değildir. Tek sütunlu listeler, boş TextAsset’ler ve ayrıştırılamayan içerik sıkı tablo sayımına dahil değildir. Dosya SHA-256 özetleri ve tüm nesne sayımları [envanterde](reference-inventory.json).

Yöntem: arşiv ve split envanteri → motor tespiti → Unity TextAsset okuma → veri katmanının çözülmesi → CSV şema ve koşul analizi → metadata type/field eşleştirme → Dart paket yolları ve model/serileştirme izleri. Metadata v39’da tablo başlıkları offset/size/count üçlüleriyle; bu dosyadaki tipler 76, alanlar 10 baytlık kayıtlarla eşleştirildi. Kaynak kod üretimi veya referans UI aktarımı yapılmadı.

## Tam sistem eşleştirmesi

| Sistem | APK’den elde edilen mimari / koşullar | YAZGI karşılığı ve uygulama durumu |
|---|---|---|
| Yaş ve açılma | Min/max yaş; ülke bazlı okul, emeklilik, ehliyet ve diğer eşikler; TC `ActivitiesAgeLimit` ve yaş dönemi sınıfları | Merkezi yaş/koşul kontrolü; 0–4 bakım, 5–9 gözetimli çocukluk, 10–17 yetişme, 18+ yetişkin sorumlulukları. Uygulandı |
| Zaman | Yaş/yıl geçişleri, senaryo kuyrukları ve kayıt geçmişi | Her yaşta 12 eylem. Bir eylem bir ay; ardından aynı ayda bir bağlamsal kart. Kart çözülmeden yeni eylem/yaş geçişi yok. Uygulandı |
| Stat ve beceriler | Sağlık, mutluluk, zekâ, görünüş, disiplin, karma, irade, atletizm, şöhret, doğurganlık gibi alanlar | Sağlık, dirlik, genel beceri, itibar + binicilik, okçuluk, savaş, zanaat, bitig, söz, ticaret. İlgili statlar korunup uzmanlık/tecrübe kapıları güçlendirildi |
| Ana meslekler | 168 satır: yaş, eğitim, bölüm, çalışma yılı, sağlık/zekâ/görünüş/karma, sicil, lisans, araç ve diğer koşullar | Çoban, avcı, at bakıcısı, demirci çırağı/demirci, ozan, tüccar, kervan rehberi, bitigçi, elçi, alp, akıncı, tarkan, bey. 14 yol korundu; koşulları merkezileştirildi |
| Yarı zamanlı işler | 82 satır: 13/14/15/16/18/21/25/50 yaş eşikleri; öğrenci, saat, yorgunluk, stat koşulları | Çocuklukta aile işine yardım ve gözetimli çıraklık; yetişkinlikte görevde çalışma ve mal yönetimi. Modern saatlik ücret sistemi aktarılmadı |
| Eğitim | Okul kademeleri, ülkeye bağlı başlangıç/mezuniyet, not/başarı; 115 okul etkinliği; stat ve seçme koşulları | Aileden öğrenme, usta yanında yetişme, at/ok/güreş talimi, söz/destan ve bitig öğrenimi. Üniversite/diploma evrenselleştirilmedi |
| Kariyer/terfi | Kıdem hattı, gerekli çalışma yılları, atlanabilen pozisyon, başarı niteliği; 19 askerî rütbe satırı | Uzmanlık + birikmiş ay tecrübesi + itibar + sefer sayısı. İşe giriş ve olayla terfi aynı kontrolü kullanır. Görev başvurusu hâlâ başarı garantisi değildir |
| Olay motoru | Scenario sınıfları, tematik veri tabloları, yaş/stat/aile/durum koşulları; TC AgeEvent/EventCreator | Ağırlık, min/max yaş, ay/mevsim, son eylem türü, flag, mülk, aile, sefer, sürgün, tutsaklık; cooldown/once; uygun maliyetli seçenek şartı. Uygulandı |
| Olay zincirleri | Eğitim, ilişki, meslek, ceza, sağlık ve özel kariyer senaryoları | Mevcut demircilik, bitig/elçilik, kervan, sefer, husumet, ocak, sürü ve sürgün zincirleri korundu; yaş ve uzmanlık açıkları kapatıldı |
| Arkadaş/rakip | NPC ilişki nitelikleri ve geçmişi; Friend/CoWorkers/Devrem modelleri | Yaşıt dostlar, rakipler, armağan, vakit geçirme, büyükten öğüt, uzlaşma; gerçek NPC ilişki puanları. Uygulandı |
| Sevgili/evlilik | Lover/Wife modelleri, ilişki ve evlenme senaryoları; 80 teklif ortamı satırı, bazılarında 18 yaş | 16+ yaşıt eş adayıyla aile aracılı tanışma; iki taraf da 18+ ve ilişki ≥65 ile ocak kurma. Bebek/çocuk evlilik seçmez |
| Çocuk | Children, fertility, aile modelleri; çocuk sağlığı/eğitimi senaryoları | İki yaşayan yetişkin, evlilik, yeterli sağlık, uygun yaş ve özgürlük koşulları; 9 aylık gebelik sayacı; doğum ayı; gerçek çocuk hedefli bakım/yetişme kartları. Uygulandı |
| Askerlik | Enlisted/officer rütbeleri, hizmet yılı ve stat koşulları; TC Askerlik/Devrem | Boy/kağanlık sefer çağrısı, katıl/reddet kartı, 4–8 aylık görev, talim, yoldaş, yara, ganimet ve tutsaklık. Çağrı kayıtta korunur; 18+ |
| Sağlık/hastalık | 107 insan hastalığı satırı: min/max yaş, belirtiler, doğal bulaşma/iyileşme, tedavi, ölümcüllük ve tedavisizlik alanları | Otacı, dinlenme, ateşli rahatsızlık, soğuk, yara ve yaşlılıkta eklem sıkıntısı için özgün basit model. 107 modern hastalık bire bir eklenmedi; gerçek tıp simülasyonu iddiası yok |
| Suç/ceza | 138 yetişkin ve 86 çocuk cezaevi suç kaydı; prison/juvenile senaryoları ve sicil | Töre ihlali, tazminat, itibar kaybı, sürgün, tutsaklık, fidye/kaçış. Oyuncunun suç eylemleri 18+. Modern hapishane ve çocuklara yetişkin suç menüsü aktarılmadı |
| Para/geçim | Maaş, gelir/gider, portföy, borç ve çeşitli mülk modelleri | Mevsim ve kıtlığa göre değişen pazar baskısı; üç aylık hane geçimi ve varlık bakımı; meslek gelirinde talep etkisi. Servet negatife düşmez, ödeme yetmezse geçim sıkıntısı sağlık/dirlik ve varlık durumuna yansır. Modern banka/borsa sistemi yok |
| Araç/mülk | Araç, gayrimenkul ve eşya sahipliği; lisans ve araç gereksinimleri | At, yay, kılıç, zırh, sürü, yurt, kervan payı, demir ocağı; alım ve takas. At/yay 12, diğerleri 18+ |
| Yatırım/işletme | Şirket, personel, üretim, satış, yatırım riskleri; TC Girisimci/KoyeDonus | Sürü, demir ocağı ve kervan payı artık durum/bakım, talep, zarar ihtimali, aktif yönetim ve değişken satış fiyatına sahip. Pasif gelir garanti değildir. Modern şirket/hisse/kripto arayüzü yok |
| Aktiviteler | Sosyal, kültürel, spor, okul ve meslek etkinlikleri | Ozan dinleme, toy, güreş, at yarışı, bakım, sürü yardımı, takas/pazar, kurultayı dinleme ve beyin otağı. Her birinin açık yaş eşiği var |
| NPC yaşamı | Person, Mother/Father, Friend, Lover/Wife, Children/Sibling, CoWorkers/Prisoners; yaş/stat/ilişki modelleri | NPC kimliği, yaş, sağlık, ilişki, meslek, eş, çocuk/torun ve ölüm; yoldaşlar dahil. Yetişkin NPC aile kurar. Soy devamında gerçek aile bağlantıları korunur |
| Yaşlılık/ölüm | Yaş ve sağlık riski, emeklilik eşikleri, atalar ve ölüm verileri | 50+ tecrübe çağı, 65+ yaşlılık; kırılganlık ve kalıcı yaralar ölüm riskine eklenir. Ölüm nedeni kayıt altına alınır; sağlık sıfırsa ay içinde ölüm |
| Miras/soy | Will, inheritance, ancestors ve legacy modelleri | 55+ aile meclisinde vasiyet hazırlığı, eşit paylaşım veya ana varis, 60+ son dilek; ölümde servet/varlık dağılımı ve ölüm nedeni kaydı. Çocukla aynı takvim yılı ve kalan aylarla devam edilir; tercihli miras kardeş güveni/kinini ve sonraki yıllardaki miras olayını etkiler. Bu paylaşım bir oyun kuralıdır |
| Achievement/unlock | AchievementManager, açılma/ödül ve oyuncu ilerleme alanları | Yaş, sefer, özgürlük, ocak, çocuk, varis, servet, ustalık, uzlaşma, beylik ve yaşlılık. Mevcut başarımlar korundu; ustalık/uzlaşma eklendi |
| Kayıt/veri modeli | BitLife Life/SimPerson/SaveSlot/SaveGameManager; TC JSON serileştirme, saveLocalDB/Hive izleri | Sürümlü LocalStorage kaydı; pending karar + ay + hedef NPC + seçim sayfası; göç öncesi yedek; bozuk kayıt üzerine yazmama. APK’nin dosya biçimi kullanılmadı |
| İçerik/asset ayrımı | Bundle/Resource, TextAsset, texture/sprite, ses, prefab, font; Flutter assets klasörleri | YAZGI’nın kendi HTML/CSS/metin/verileri korunur; kurallar `systems.js` içinde; analitik ekler `docs/` altında. Referans asset yok |

## TC Simülasyonu özel kariyerleri

Bu yollar AOT paket isimleriyle doğrulandı; aşağıdaki yaşlar TC’den çıkarılmış sayılar değildir. Aşağıdaki eşleştirmeler sistem tasarımıdır; her özel kariyer ayrı bir minioyun olarak uygulanmış değildir.

| Paket alanı | Tarihsel uyarlama kararı |
|---|---|
| Askerlik | Boy seferi ve birlik/yoldaş döngüsü |
| Girisimci, KoyeDonus | Sürü, demir ocağı, kervan ortaklığı |
| ArabaYarisi | Binicilik ve toyda at yarışı |
| DonerUstasi, Pizzaci, SuperMarket | Modern işletmeleri taşımak yerine toy için yiyecek hazırlama, erzak ve takas; ayrı meslek/minioyun henüz yok |
| GuzellikMerkezi | Temel saç/bakım etkinliği; modern salon yok |
| Influencer | Söz/itibar ve ozan aracılığıyla ün; sosyal medya yok |
| Mafya, Mafya2 | Töre dışı kazanç, husumet, yağma ve karşılıkları; modern suç örgütü hiyerarşisi yok |
| Muzisyen, Ressam | Ozanlık ve zanaat/süsleme; modern kayıt şirketi/galeri yok |
| Politika | Boy itibarı, elçilik, kurultay ve beylik; modern seçim/parti sistemi yok |
| PasaportPolisi, TrafikPolisi | Yol/geçit gözcülüğü kavramsal karşılık; pasaport ve trafik polisi mesleği yok |
| PetPaketi | At/hayvan bakımı; tüm modern evcil hayvan türleri aktarılmadı |
| Spor | Güreş, binicilik, okçuluk |
| Tatil | Dinlenme ve ziyaret; modern turizm/paket tatil yok |
| AaCommons | Ortak özel-kariyer altyapısı; ayrı bir oynanış alanı değil |

Uzay, çağdaş istihbarat teknolojileri, kumarhane işletmesi, modern şirketler, uçaklar, vampir/zombi gibi fantastik paketlerin zorlanmış tarihsel kopyası yapılmadı. Kimlik olarak karşılığı bulunmayan meslekler eklenmez; taşıma, öğretme, tedavi etme gibi işlevler gerektiğinde döneme uygun özgün sistemde değerlendirilir. Bir modern doktor uzmanlığını doğrudan “otacı” saymak, aynı teknik kapasiteyi var saymak anlamına gelmez.

## YAZGI yaş ve erişim sözleşmesi

Bu eşikler **oyun tasarımıdır**. Bütün İslamiyet öncesi Türk topluluklarında geçerli tek bir yetişkinlik, evlilik, eğitim veya askerlik yaşı olduğu ileri sürülmez. Ciddi oyuncu kararları için bu sürüm 18 yaş eşiği kullanır.

| Minimum yaş | Açılan eylem | Ek koşul / kapsam |
|---:|---|---|
| 0 | Aile bakımında ay geçirme, bakım kartları | 0–4 seçim aktörü aile/bakıcıdır; iş, yatırım, evlilik, suç ve sefer yok |
| 5 | Gözetimli at binme, yakınla vakit, dinlenme, aileyle otacı | Otacı 2 servet; çocuk tek başına büyük karar almaz |
| 6 | Dost edinme, büyüğe danışma, toya katılma, ozan/güreş izleme | Öğüt alınan kişi en az 16 ve oyuncudan büyük |
| 7 | Gözetimli okçuluk | Çocuğa uygun talim; savaş görevi değil |
| 8 | Güreş talimi, söz/destan, at bakımı | Gözetimli yetişme |
| 10 | Sürüye yardım, temel zanaat öğrenimi, armağan, yaşıt rekabeti | Çoban yardımı için ayrıca beceri; armağan 3 servet |
| 12 | Gözetimli av/bakım/çıraklık, bitig, at yarışı, pazar, at/yay | Bağımsız yetişkin işletmesi veya sefer değil; kaçış yalnız tutsaksa |
| 15 | Kervan pazarını gezme | Ticaret öğrenme; kervana sermaye koyma değil |
| 16 | Kurultayı dinleme, yaşıt eş adayıyla tanışma, ozanlık adayı | Oy verme/yönetme veya evlenme değil; ozanlık için beceri ve tecrübe gerekir |
| 18 | Evlilik, çocuk, sefer, töre dışı eylem, mülk/sermaye, mal paylaşımı | Sağlık, ilişki, mülk, meslek ve tecrübe kapıları ayrıca geçerli |
| 22 | Elçi | Bitig/söz ve devlet tecrübesi |
| 24 | Tarkan | Beceri, itibar, tecrübe ve 3 sefer |
| 28 | Boy beyi | Beceri, itibar ve devlet tecrübesi |
| 50 | Ağır görevi bırakma; yaşlılığa bağlı eklem sıkıntısı olasılığı | Aktif görev varsa bırakılabilir |
| 65 | Yaşlılık başarımı | Hayatta bu yaşa ulaşma |

Tutsaklıkta sivil eylemler kapalıdır. Seferde talim, bakım, bekleme ve birlikten ayrılma dışındaki sivil eylemler kapalıdır. Eylem hakkı bitmişse veya karar bekliyorsa hiçbir eylem tekrar harcanamaz. Bu kurallar yalnızca butonlarda değil bütün eylem işleyicilerinde uygulanır.

### Mesleklerin eksiksiz koşul tablosu

Bütün meslekler ayrıca mevcut genel beceri eşiğine tabidir; `max(0, meslek.skill − 10)` değeri görev kartında gösterilir. Askerî görevler sağlık ≥40 ister; devlet/askerî görevler sürgünde alınamaz. Uzmanlık sayıları 0–100 aralığındadır. Aşağıdaki aylar ilgili alanda tecrübedir; yaşın kendisi tecrübe yerine geçmez.

| Yol | Yaş | Uzmanlık | Tecrübe | Diğer |
|---|---:|---|---|---|
| Çoban | 10 | Binicilik 10 | — | 18 altı gözetimli oba/sürü yardımı |
| Avcı | 12 | Okçuluk 20, binicilik 10 | — | 18 altı gözetimli |
| At bakıcısı | 12 | Binicilik 25 | — | 18 altı gözetimli |
| Demirci çırağı | 12 | Zanaat 17 | — | Usta gözetimi |
| Demirci | 18 | Zanaat 40 | Zanaat 12 ay | — |
| Ozan | 16 | Söz 35 | Kültür 6 ay | — |
| Tüccar | 18 | Ticaret 35 | Ticaret 12 ay | — |
| Kervan rehberi | 18 | Ticaret 30, binicilik 25 | Ticaret 6 ay | — |
| Bitigçi | 18 | Bitig 50 | Devlet 12 ay | — |
| Elçi | 22 | Bitig 55, söz 45 | Devlet 24 ay | — |
| Alp | 18 | Savaş 45, okçuluk 30, binicilik 30 | — | Sağlık 40 |
| Akıncı | 18 | Savaş 50, binicilik 40 | Askerî 6 ay | Sağlık 40 |
| Tarkan | 24 | Savaş 66, söz 40 | Askerî 24 ay | İtibar 35, 3 sefer, sağlık 40 |
| Boy beyi | 28 | Söz 60, bitig 40 | Devlet 36 ay | İtibar 45 |

Demir ocağı alımı ayrıca zanaat 40 ve 12 ay zanaat tecrübesi ister. Referansın 168 mesleğinin ve 82 işinin kendi sayısal koşulları [ayrı ekte](REFERANS-MESLEKLER.md); bunlar YAZGI’ya topluca kopyalanmış meslekler değildir.

## Olay seçiminin koşul sırası

```mermaid
flowchart TD
    A["Eylem isteği"] --> B{"Yaş, durum, hak ve maliyet uygun mu?"}
    B -->|Hayır| C["İşlemi reddet; ay harcama"]
    B -->|Evet| D["Eylemi uygula; bir ay harca"]
    D --> E["Sağlık, görev, üretim ve doğum sayaçları"]
    E --> F{"Karakter yaşıyor mu?"}
    F -->|Hayır| G["Ölüm ve varis"]
    F -->|Evet| H["Yaş + durum + ay + eylem + önkoşul filtresi"]
    H --> I["Cooldown, tek sefer ve ödenebilir seçim kontrolü"]
    I --> J["Ağırlıklı olay veya uygun yedek kart"]
    J --> K["Aynı ayın kararını kaydet"]
    K --> L["Sola/sağa sürükle; sonucu ve geçmişi kaydet"]
```

Örnekler: kış darlığı yalnız 10–12. aylarda; kuraklık 4–6. aylarda ve sürü sahipliğinde; yaralanma eylem bağlamında; sefer kartları aktif seferde; ganimet kartı yakın sefer sonucuna bağlı; sürgünden dönüş sürgün ve bağlılık flag’i ister. Çocuk yetiştirme kartı gerçekten yaşayan 7–17 yaş çocuk hedefler. Arkadaş kavgası yaşayan dost gerektirir. Bilinmeyen bir önkoşul otomatik olarak başarılı kabul edilmez.

Her kart iki seçenekle sınırlı olmak zorunda değildir: üç veya daha fazla seçenek varsa sağa sürükleme sonraki alternatifleri açar; son seçim yapılana kadar ay değişmez. Fare, dokunma, ok tuşları ve yön düğmeleri aynı işleyiciyi kullanır. Yeni eylem başlatan popup yok; yeni karakter ve ölüm/varis pencereleri korunur.

## Kayıt ve NPC şeması

| Kayıt bölümü | YAZGI alanları / ilişkileri |
|---|---|
| Kimlik ve zaman | `version`, `id`, ad/cinsiyet/dönem/yer/boy, doğum yılı, yaş, `monthsRemaining` |
| Oyuncu | sağlık, dirlik, genel beceri, itibar, servet, uzmanlıklar |
| İlerleme | görev/yol, `experience`, `careerMonths`, varlıklar, başarımlar |
| Aile | parents, siblings, friends, rivals, partner, children; NPC id, yaş, sağlık, ilişki, alive, eş/descendants |
| Doğum | `pregnancy.remaining`, NPC `birthYear` ve `birthMonth`; doğum günü doğru ayda ilerler |
| Durum | captive, exile, military.active/dutyMonths/campaigns/wounds/comrades, ailments |
| Olay | pendingEventId, pendingEventContext(age/year/month/kind/targetId), decisionOffset, pendingDecision |
| Hafıza | eventHistory, eventCooldowns, eventArchive, flags, timeline, crimeRecord |
| Miras | will, legacy.generation/familyName/past, gerçek ebeveyn ve kardeş ilişkileri |

`yazgi_full_v1` anahtarı korunur; güncel kayıt sürümü 9’dir. Eski kaydın ilk sürüm-6 göçünde `yazgi_before_v9` yedeği alınır. Eski kayıt NPC, varlık, başarı ve olay geçmişlerini korur; eksik yeni alanlar tamamlanır. Yaşı uygun olmayan eski görev `deferredRole`, evlilik `deferredMarriage` olarak ayrılır; partner silinmez. Uygun yaşa gelince oyuncu yeniden karar verir. Bozuk kayıt sessizce yeni oyunla değiştirilmez.

Referans modellerinin alan envanteri [reference-models.json](reference-models.json), TC paket yolları [reference-tc-paths.json](reference-tc-paths.json), bütün çözümlenmiş tablo şemaları ve koşul satırları [reference-conditions.json](reference-conditions.json) içindedir. JSON satır numaraları ilgili tablonun veri satırını belirtir. Boş koşul değeri çalışma zamanında sınırsız erişim kanıtı değildir.

## Tarihsel yaklaşım

Göktürk/Uygur/Batı Türk dünyaları tek ve değişmez bir toplum gibi modellenmemelidir. Göçer hayvancılık, yerleşik merkezler, zanaat ve uzun mesafeli ticaretin birlikte var olması tasarımın dayanağıdır. Dönem/bölgeye göre gelişecek ayrıntılar, tek bir modern mesleğin adını değiştirerek tamamlanmış sayılmaz.

Başvuru çerçevesi: [UNESCO Orkhon Valley Cultural Landscape](https://whc.unesco.org/en/list/1081/), [UNESCO Silk Roads: Chang’an–Tianshan Corridor](https://whc.unesco.org/en/list/1442/), [UNESCO Silk Roads teknik bilgi alışverişi](https://en.unesco.org/silkroad/content/did-you-know-exchange-technical-knowledge-used-craft-silk-roads-goods). Bu kaynaklar oyun içindeki sayısal yaş, hastalık veya miras formüllerini doğrulamaz; onlar açıkça tasarım tercihleridir.

## Uygulama kapsamı ve kalan araştırma

Bu değişiklik, mevcut oynanabilir sistemlerin yaş/zaman/kayıt tutarlılığını güçlendirir ve sağlık, uzmanlık tecrübesi, üretim, NPC ilişkileri ve mal paylaşımı için çalışan temel ekler. Referansların bütün özel kariyer minioyunları, yüzlerce hastalığı veya bütün native senaryoları uygulanmış değildir. TC’nin gerçek sayısal açılma sabitleri ve BitLife’ın tablo dışı native/sunucu kapıları daha ileri doğrulama gerektirir. Bu sınırları “eksiksiz kod çözümü” diye gizlemek yerine eklerde gözlenen veriyi ve tasarım kararını ayrı tutuyoruz.


### Tutsaklık, sürgün ve barınma uyarlaması

Modern yaşam simlerindeki hapishane/evsizlik derinliği isteği YAZGI’ya dönem bağlamında uyarlandı. Hapishane işi yerine tutsak kampında emek ve erzak, telefon/ziyaret yerine yakınlara haber-fidye desteği, evsizlik yerine sürgünde barınak ve erzak güveni kullanılır. Tutsak veya sürgünde tanışılan NPC’ler kalıcı ilişkiye dönüşebilir; önceki bölümden çıkınca geçmiş kaydı saklanır.


### Yaşam çeşitliliği ve tekrar karşıtı döngü

Oyuncunun her yıl aynı birkaç eylemi tekrarlamasını azaltmak için v9 ile kalıcı yaşam çeşitliliği profili eklendi. Her yıl karakterin yaşına ve mevcut durumuna uygun bir yıllık amaç seçilir; farklı faaliyet, eğitim, aile, meslek, ticaret, sağlık, işletme ve mevsim hedefleri arasında dönüşür. İlkbahar, yaz, sonbahar ve kışta görünen mevsimlik faaliyetler farklıdır. Faaliyet geçmişi saklanır; yeni veya seyrek yapılan uğraşlar ek canlılık verirken aynı faaliyetin arka arkaya aşırı tekrarı ek mutluluk sağlamaz ve küçük bir tekrar yorgunluğu yaratır. Bu yapı sadece daha fazla buton eklemek yerine yılların birbirinden farklı akmasını hedefler.
