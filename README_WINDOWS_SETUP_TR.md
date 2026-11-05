# LEGENDS OF ETERNIA — Windows masaüstü test paketi

## Bu paket ne yapar?
Bu proje, mevcut tarayıcı prototipini Windows masaüstü penceresinde açan bir Electron kabuğu içerir. Windows kurulum dosyası, Windows bilgisayarda oluşturulur.

## Setup.exe oluşturma
1. Windows bilgisayarında Node.js LTS kur.
2. Bu ZIP'i tamamen bir klasöre çıkar.
3. `WINDOWS_SETUP_OLUSTUR.bat` dosyasına çift tıkla.
4. İşlem bitince `dist` klasöründe `LEGENDS-OF-ETERNIA-Setup-0.5.1.exe` dosyası oluşur.
5. Bu Setup.exe dosyasını arkadaşlarına gönderebilirsin.

İlk kurulum sırasında internet gerekir; Electron ve paketler indirilir. Windows Defender bilinmeyen/henüz imzalanmamış bir test uygulaması için uyarı gösterebilir. Bu beklenen bir test-build uyarısıdır; dosyayı yalnızca kendin oluşturduysan ve kaynağına güveniyorsan çalıştır.

## Önemli çevrim içi sınır
Bu masaüstü paketi her bilgisayarda oyunun kendi yerel sunucusunu açar. Arkadaşlarının aynı dünyada birlikte oynamasını sağlamaz. Bunun için ayrıca tek bir merkezi sunucuyu internette barındırıp masaüstü istemcilerini o sunucuya bağlamak gerekir. Mevcut sunucu henüz hesap/veritabanı, kimlik doğrulama veya üretim güvenliği içermediği için doğrudan herkese açık internete açılmamalıdır.

Bu bir test sürümüdür; ticari dağıtıma hazır, imzalı bir oyun kurulumu değildir.


## Arkadaşların aynı dünyada buluşması
1. Önce `DEPLOY_RENDER_TR.md` adımlarını takip ederek merkezi sunucuyu yayınla.
2. Render'ın verdiği adresi `public/config.js` içine `wss://...` biçiminde yaz.
3. Sonra `WINDOWS_SETUP_OLUSTUR.bat` dosyasını yeniden çalıştır.
4. Yeni `dist/LEGENDS-OF-ETERNIA-Setup-0.6.0.exe` dosyasını arkadaşlarına gönder.
5. Herkes kurulumdan sonra aynı merkezi sunucuya bağlanır.

Sunucu adresi henüz girilmediyse masaüstü uygulaması kendi bilgisayarında yerel test sunucusunu açar; ortak dünya bağlantısı kurulmaz.


## v0.6.1 ganimet paylaşımı
Parti kurup çevrim içi oyuncu adına davet gönderebilirsin. Aynı canavara verilen hasar sunucuda toplanır. En yüksek toplam hasara sahip parti ekipman hakkını alır; ekipmanlar üyeler arasında sırayla dağıtılır, para eşit bölünür. Parti dışındaki oyuncular arasında en yüksek hasarı veren kişi sandığı alır.
