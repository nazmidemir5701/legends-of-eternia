# LEGENDS OF ETERNIA — MMORPG Prototype 0.2

Original genre-inspired fantasy MMORPG prototype. It does not copy proprietary skills or assets from existing games.

## Run locally (Windows 11)
1. Install Node.js LTS from https://nodejs.org/
2. Extract this ZIP.
3. Open the `legends_of_eternia` folder in File Explorer.
4. Click the address bar, type `cmd`, press Enter.
5. Run `npm install`
6. Run `npm start`
7. Open http://localhost:3000

## Included prototype systems
- Third-person 3D open-world movement.
- Five classes: Savaşçı, Rahip, Okçu, Suikastçi, Tank.
- One randomized starter skill; class unlock at level 10.
- Per-class first-picker special skill in the running server process; later picks receive a normal class skill.
- Two opening bosses; main-village choice remains locked until both are defeated.
- Five main-village choices.
- Monsters, boss combat, XP, crystal gathering, skill use, equipment drops.
- Eleven equipment rarity tiers: Kara Demir, Tunç, Bronz, Gümüş, Altın, Kara Altın, Platin, Elmas, Yıldız, Ölümsüz, Tanrısal.
- Death in the starting village has no level/equipment penalty; death after choosing a main village removes one level and up to two inventory items.
- A milestone prompt every ten levels for a high-difficulty dungeon/event.
- Basic WebSocket player position and shared opening-boss health synchronization.
- Three companion pets (Silver Fox, Ash Wolf, Star Spirit) that follow the player and automatically attack nearby enemies.
- Companion raising: feed with 5 crystals, increase bond, gain pet XP from battles, and level up the pet.
- Six companion rarity tiers: Common, Uncommon, Rare, Epic, Legendary, Mythic, with rarity-based combat bonuses and visual auras.
- Four mutation paths: Flame, Ice, Lightning, Shadow. Mutations use 10 crystals and one Mutation Core, add visual effects and boost companion damage; boss kills grant Mutation Cores.
- Three rideable mounts (Traveler Horse, Forest Stag, Night Wolf); M toggles riding and mounts increase movement speed.

## Important limitations
This is a playable systems prototype, not a production MMORPG. Some progression and loot are currently client-side and saved in the browser; the first-picker class registry and boss health are held in server memory and reset when the server restarts. Combat validation, persistent accounts/database, robust party/group contribution, secure inventory and death handling, real dungeon instances, rankings/reward distribution, chat/moderation, anti-cheat, and production hosting remain to be implemented. Shared boss synchronization is a prototype and must be made fully server-authoritative before a public competitive launch.


## v0.5 — Yaratık Rehberi, Para Birimi ve Ekipman Dengesi
- Yaratık Rehberi yalnızca 1–10. seviye yaratıkların can, saldırı, hız ve ganimet bilgilerini gösterir. 11+ seviye yaratıklar listelenmez.
- Para birimi: 1 altın = 1.000 gümüş, 1 gümüş = 1.000 bakır. Yaratık seviyesi yükseldikçe bakır para ödülü artar; bosslar daha yüksek ödül verir.
- Başlangıç Köyü ekipmanları beyaz kalitededir; sınıf ve seviye şartı yoktur. Ekipman savunması ve verdiği can, onu düşüren yaratığın seviyesine göre artar. Örnek: seviye 1 yaratık yaklaşık 1 savunma/10 can; seviye 6 yaratık 10 savunma/100 can.
- Yoldaşa P tuşuyla yakındaki bir yaratığı hedef gösterebilirsin. Yoldaş hedefe saldırır; hedef yenilince otomatik hedeflemeye döner.

## Önemli teknik sınırlar
Bu sürüm oynanabilir bir tarayıcı prototipidir. Para, ekipman, evcil hayvan ve karakter ilerlemesi bu tarayıcıdaki localStorage içinde tutulur. Kalıcı çevrim içi hesap/veri tabanı, güvenli herkese açık barındırma, tam parti/lonca/ticaret/sohbet ve küresel derece tablosu henüz tamamlanmış değildir. Bunlar için kimlik doğrulama, sunucu tarafı oyun mantığı, veritabanı ve internete açık bir sunucu kurulumu gerekir.


## v0.6 — Ortak dünya test altyapısı, beceri çubuğu ve ganimet
- Aynı sunucuya bağlı istemciler için oyuncu konumları, boss canı, yaratık ölümleri/yeniden doğmaları ve ganimet sandıkları WebSocket üzerinden eşitlenir.
- Ortak başlangıç haritası sabit dünya tohumu ile oluşturulur.
- 1–5 beceri çubuğu; K ile beceri kitabı; becerileri slota yerleştirme.
- Can ve mana göstergeleri; H ile can iksiri, J ile mana iksiri.
- Yaratıklar yenilince sandık bırakır. Sandığa tıklayıp içindeki ganimetleri toplayabilirsin.
- Vuruşlarda ve yeteneklerde görsel efektler, iyileştirilmiş ışık/gölge ayarları.

## Ortak internet sunucusu
- `Dockerfile`, `render.yaml` ve `DEPLOY_RENDER_TR.md` bulut sunucusu dağıtımı için eklendi.
- Dağıtım adresi alındıktan sonra `public/config.js` içine `wss://...` adresi yazılır.
- Sunucu belleğinde eşzamanlanan test dünyası vardır; yeniden başlatmada durum sıfırlanır.
- Gerçek hesap/veritabanı, kalıcı envanter, güvenli kimlik doğrulama ve tam sunucu tarafı savaş doğrulaması henüz yoktur. Bu nedenle yalnızca arkadaşlarla kontrollü test içindir.
- Grafikler geliştirilmiş ışıklandırma ve efektlere sahip stilize 3D prototiptir; özel yüksek çözünürlüklü karakter/çevre modelleri ve motion-capture animasyonları içeren AAA gerçekçilik seviyesinde değildir.


## v0.6.1 — Parti ganimeti ve hasar sıralaması
- Her oyuncunun canavara verdiği hasar sunucuda katkı kaydına eklenir.
- Aynı partideki oyuncuların hasarları birleştirilir; en yüksek toplam katkıya sahip taraf sandık hakkını kazanır.
- Parti sandığında ekipmanlar parti üyelerine katılım sırasına göre dönüşümlü atanır. Ekipman olmayan sandıklar sırayı ilerletmez.
- Sandıktaki bakır değerindeki para çevrim içi parti üyelerine eşit bölünür; artan bakırlar parti sırasına göre dağıtılır.
- Parti dışında kalan oyuncular arasında en yüksek hasarı veren oyuncu sandığın tamamını alır.
- Parti oluşturma, oyuncu adına davet, daveti kabul etme ve partiden ayrılma kontrolleri eklendi.
- Sunucu, sandığı yalnızca kazanan oyuncuya veya kazanan partiye açar. Bu test sürümünde hasar raporu ve bazı savaş hesapları istemciden geldiği için sistem henüz hileye karşı tam güvenli değildir.
