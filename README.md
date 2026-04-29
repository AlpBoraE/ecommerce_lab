# AAD Shop - Full-Stack E-Commerce

Bu proje PDF'deki isterlere gore hazirlanmis basit bir e-ticaret uygulamasidir.

## Teknolojiler

- Backend: Java 21, Spring Boot, Spring Data JPA, H2
- Frontend: Angular, TypeScript, RxJS, Reactive Forms
- Yetkilendirme: Basit JWT token, user/admin rolleri, user route guard ve admin route guard

## Calistirma

Backend:

```powershell
cd backend
mvn package
java -jar target\ecommerce-backend-0.0.1-SNAPSHOT.jar
```

Frontend:

```powershell
cd frontend
npm install
npm start
```

Adresler:

- Frontend: http://localhost:4200
- Backend API: http://localhost:8080/api
- H2 Console: http://localhost:8080/h2-console

Admin girisi:

- Kullanici adi: `admin`
- Sifre: `123456`

User girisi:

- Kullanici adi: `user`
- Sifre: `123456`

## Proje Yapisi

Backend'de anlatilacak ana akis:

- `entity`: Veritabani tablolari. Product, Category, Customer, CustomerOrder, OrderItem.
- `repository`: Spring Data JPA ile otomatik CRUD islemleri.
- `service`: Is kurallari. Urun kaydetme, siparis olusturma, stok azaltma, login.
- `controller`: REST endpoint'leri. Frontend buraya HTTP istegi atar.
- `config`: CORS, admin interceptor ve baslangic verileri.
- `security`: JWT token uretme ve dogrulama.

Frontend'de anlatilacak ana akis:

- `models.ts`: Backend'den gelen verilerin TypeScript tipleri.
- `services`: API haberlesmesi, sepet, login, token interceptor, auth guard ve admin guard.
- `pages`: Product list, product detail, cart, order summary, login, admin panel, admin orders, product form.

## Onemli Endpoint'ler

- `GET /api/products`: Urun listesi, kategori ve arama filtresi destekler.
- `GET /api/products/{id}`: Urun detayi.
- `GET /api/orders`: Login olmus USER hesabinin kendi siparislerini listeler.
- `POST /api/orders`: Sadece login olmus USER hesabi icin sepetteki urunlerle siparis olusturur.
- `PATCH /api/orders/{id}/cancel`: USER kendi siparisini iptal eder ve stogu geri ekler.
- `POST /api/auth/login`: Admin veya user icin JWT token dondurur.
- `GET /api/admin/orders`: Admin panelinde verilen siparisleri listeler.
- `PATCH /api/admin/orders/{id}/cancel`: Admin verilen siparisi iptal eder ve stogu geri ekler.
- `POST /api/admin/products`: Urun ekler.
- `PUT /api/admin/products/{id}`: Urun gunceller.
- `DELETE /api/admin/products/{id}`: Urun siler.

## Kisa Anlatim

Kullanici `user / 123456` ile login oldugunda Angular arayuzunde urunleri gorur, arama ve kategori filtresi kullanabilir, urunu sepete ekler, siparis formunu doldurur ve My Orders sekmesinde kendi siparislerini gorur/iptal eder. Sistem `USER` role sahip JWT token saklar ve siparis olusturmayi sadece bu role acar.

Admin `admin / 123456` ile login oldugunda sadece urun duzenleme ve verilen siparisleri gorme/iptal etme ekranlarini kullanir. Backend JWT token uretir. Angular bu token'i `localStorage` icinde saklar ve `authInterceptor` her istege `Authorization` header'i olarak ekler. Backend'deki `AdminAuthInterceptor` sadece `/api/admin/**` endpoint'lerini korur. Frontend'deki `adminGuard` da sadece `ADMIN` rolunun admin sayfalarina girmesine izin verir.

## Kontrol Edilenler

- `mvn test` basarili.
- `npm run build` basarili.
- User login ile `USER` token alinabilir.
- Admin login ile admin paneline girilebilir.
- User role admin paneline giremez.
