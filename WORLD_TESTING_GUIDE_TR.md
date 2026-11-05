# LEGENDS OF ETERNIA v0.6 — Arkadaşlarla test

## Tuşlar
- WASD: hareket
- Fare: kamera
- Sol tık: saldırı / nişangâhtaki sandığı açma
- 1–5: beceri çubuğundaki becerileri kullanma
- K: beceri kitabı
- H: can iksiri
- J: mana iksiri
- P: evcil hayvana hedef gösterme
- M: bineğe binme / inme
- E: kristal ve ganimet etkileşimi

## Ganimet
Bir canavarı veya bossu yenince sandık düşer. Sandığı nişangâhın altına alıp sol tıkla. Açılan pencerede ganimetleri topla.

## Beceri çubuğu
K tuşuyla beceri kitabını aç. Beceriye tıklayıp 1–5 arasında bir slot seç. Ardından ilgili sayı tuşuyla kullan.

## İksirler
H can iksiriyle 55 can, J mana iksiriyle 55 mana yeniler. Başlangıçta her iksirden 5 adet bulunur. Mana zamanla yavaşça yenilenir; beceriler 20 mana tüketir.

## Çok oyunculu test
Herkes aynı `wss://` sunucu adresine bağlanmalıdır. Oyuncular, boss canı, normal yaratıkların ölümü/yeniden doğması ve sandıkların alınması sunucu üzerinden eşzamanlanır.


## Parti ve ganimet paylaşımı
1. Oyunculardan biri `Parti kur` düğmesine basar.
2. Parti lideri, yanındaki oyuncu adı alanına çevrim içi arkadaşının karakter adını yazar ve `Davet et` düğmesine basar.
3. Arkadaşı daveti kabul edince partiye katılır. Parti en fazla 5 kişidir.
4. Parti üyeleri bir canavara birlikte hasar verirse katkıları birleştirilir. En yüksek toplam katkıya sahip taraf ganimet hakkını kazanır.
5. Parti sandığındaki ekipmanlar üyelerin partiye katılma sırasına göre dönüşümlü dağıtılır. Para çevrim içi üyeler arasında eşit paylaşılır.
6. Aynı canavara parti dışında vuran oyuncular arasında en yüksek hasarı veren kişi sandığı alır.
