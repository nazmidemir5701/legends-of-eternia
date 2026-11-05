# Ortak internet dünyasını yayınlama (Render)

Bu dosyalar oyunun ortak WebSocket sunucusunu bir bulut servisine dağıtmak için hazırlandı. Ben senin adına bir Render hesabı açamam veya hesabında dağıtım başlatamam; bunu hesap sahibi olarak senin yapman gerekir.

## 1) Projeyi GitHub'a yükle
1. GitHub'da yeni ve özel (private) bir depo oluştur.
2. Bu ZIP'i açıp içindeki proje dosyalarını depoya yükle.
3. `render.yaml`, `Dockerfile`, `server.js` ve `public` klasörü kök dizinde olmalı.

## 2) Render'da yayınla
1. Render hesabına giriş yap.
2. New > Blueprint seç ve GitHub deponu bağla.
3. Render `render.yaml` dosyasını bulduğunda `legends-of-eternia-world` servisini oluştur.
4. Dağıtım tamamlanınca sana `https://...onrender.com` benzeri bir adres verilir.
5. Sağlık kontrolü için adresin sonuna `/health` ekleyebilirsin. JSON yanıtında `ok:true` görünmeli.

## 3) Masaüstü istemcisini ortak sunucuya bağla
`public/config.js` dosyasındaki boş adresi, Render adresinin `wss://` biçimiyle değiştir:
`window.ETERNIA_SERVER_URL = 'wss://SENIN-SERVISIN.onrender.com';`

Bu değişikliği yaptıktan sonra Windows'ta `WINDOWS_SETUP_OLUSTUR.bat` dosyasını çalıştırarak yeni Setup.exe oluştur. Aynı yapılandırılmış kurulum dosyasını arkadaşlarına gönder.

Tarayıcıdan oynayacak arkadaşlar Render'ın `https://...` adresini doğrudan açabilir; tarayıcı istemcisi aynı alan adındaki WebSocket bağlantısını otomatik kullanır.

## Dünya paylaşımı ve sınırlar
- Aynı sunucuya bağlanan oyuncular aynı başlangıç haritası, oyuncu konumları, boss canı, yaratık ölümleri ve sandıklar üzerinde eşzamanlanır.
- Bu test sunucusunda dünya durumu RAM'de tutulur. Sunucu yeniden başlarsa boss/yaratık/sandık durumu sıfırlanır.
- Kalıcı hesap, veritabanı, güvenli kimlik doğrulama, hile önleme ve tam yetkili sunucu savaş doğrulaması henüz yoktur.
- Ücretsiz bulut planları uykuya geçebilir veya kaynak sınırları uygulayabilir. Gerçek, kesintisiz halka açık MMORPG sunucusu için ücretli barındırma, veritabanı, izleme, yedekleme ve güvenlik çalışması gerekir.
- Bu dağıtım arkadaşlarla kontrollü test içindir; ticari veya geniş kitleye açık sürüm olarak değerlendirilmemelidir.
