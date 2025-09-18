# مشروع الخدمات الطبية - Lakhdar

مرحبًا بك في مشروع "Lakhdar" للخدمات الطبية. هذا التطبيق هو عبارة عن منصة ويب حديثة ومتكاملة تم تصميمها لتسهيل التفاعل بين المرضى والأطباء. تم بناء المشروع باستخدام Next.js، وهو يقدم تجربة مستخدم سلسة وسريعة الاستجابة مع واجهات مخصصة لثلاثة أنواع مختلفة من المستخدمين: المرضى، الأطباء، والمسؤولون.

## نظرة عامة على المشروع

يهدف المشروع إلى حل مشكلة البحث عن الأطباء وحجز المواعيد. يمكن للمرضى البحث عن الأطباء حسب التخصص أو الموقع، والتحقق من أعراضهم باستخدام أداة مدعومة بالذكاء الاصطناعي، وحجز المواعيد بسهولة. من ناحية أخرى، يمكن للأطباء إدارة ملفاتهم الشخصية، وجداول مواعيدهم، والتواصل مع زملائهم الأطباء عبر منتدى خاص. كما توجد لوحة تحكم للمسؤول لمراجعة طلبات تسجيل الأطباء الجدد وإدارة النظام.

## ✨ الميزات الرئيسية

### 👤 للمرضى (Patient)
- **فاحص الأعراض بالذكاء الاصطناعي**: أداة لمساعدة المرضى على تحديد التخصص الطبي المناسب بناءً على أعراضهم.
- **بحث متقدم عن الأطباء**: إمكانية البحث عن الأطباء بالاسم أو التخصص أو الموقع.
- **حجز المواعيد**: نظام سهل لحجز المواعيد المتاحة لدى الأطباء.
- **اقتراحات الذكاء الاصطناعي**: في حال كان الموعد المختار غير متاح، يقترح النظام مواعيد بديلة ذكية.
- **إدارة المواعيد**: عرض قائمة بالمواعيد القادمة وإمكانية إلغائها.
- **إدارة الملف الشخصي**: تحديث المعلومات الشخصية.

### 🩺 للأطباء (Doctor)
- **لوحة تحكم خاصة**: عرض ملخص للمواعيد اليومية والإجمالية.
- **إدارة المواعيد**: عرض قائمة بالمرضى القادمين وإمكانية إلغاء المواعيد.
- **قائمة مرضى قابلة للطباعة**: إنشاء وطباعة قائمة بالمرضى ليوم محدد.
- **إدارة الملف الشخصي والإعدادات**: تحديث السيرة الذاتية، وإضافة صور ترويجية للعيادة، وتحديد الحد الأقصى للمواعيد اليومية.
- **منتدى الأطباء**: مساحة آمنة للأطباء لمناقشة الحالات الطبية والأبحاث.
- **مراسلة مباشرة**: التواصل بشكل خاص مع الأطباء الآخرين في شبكة الاتصالات.

### ⚙️ للمسؤول (Admin)
- **لوحة تحكم المسؤول**: واجهة لمراجعة طلبات تسجيل الأطباء الجدد والموافقة عليها أو رفضها.
- **عارض قاعدة البيانات**: أداة لعرض محتويات جدولي `doctors` و`appointments` مباشرة من التطبيق لمراقبة البيانات.

## 🚀 التقنيات المستخدمة

- **إطار العمل (Framework)**: [Next.js](https://nextjs.org/) (مع App Router والمكونات من جانب الخادم).
- **لغة البرمجة**: [TypeScript](https://www.typescriptlang.org/).
- **الواجهة الأمامية (Frontend)**: [React](https://reactjs.org/).
- **التصميم والواجهة (UI/Styling)**: [Tailwind CSS](https://tailwindcss.com/) و [ShadCN UI](https://ui.shadcn.com/).
- **الذكاء الاصطناعي (AI)**: [Google Gemini](https://ai.google.dev/) عبر [Genkit](https://firebase.google.com/docs/genkit).
- **قاعدة البيانات (Database)**: [MySQL](https://www.mysql.com/).

---

## 🛠️ دليل الإعداد والتشغيل المحلي

اتبع هذه الخطوات لتشغيل المشروع على جهازك المحلي.

### المتطلبات الأساسية
- [Node.js](https://nodejs.org/) (الإصدار 18 أو أحدث).
- [Git](https://git-scm.com/).
- خادم قاعدة بيانات [MySQL](https://www.mysql.com/downloads/) (يمكنك استخدام XAMPP, WAMP, MAMP أو Docker).
- مفتاح API الخاص بـ Google Gemini.

### الخطوة 1: تنزيل المشروع ورفعه إلى GitHub (مهم جدًا)

1.  **تنزيل المشروع من Firebase Studio**:
    - من القائمة العلوية، اختر `File` -> `Save Workspace As...`.
    - سيتم تنزيل المشروع كملف مضغوط (`.zip`) على جهازك.

2.  **فك ضغط الملف**:
    - قم بفك ضغط الملف الذي قمت بتنزيله في المكان الذي تفضله.

3.  **إنشاء مستودع جديد على GitHub**:
    - اذهب إلى [github.com/new](https://github.com/new).
    - أعطِ المستودع اسمًا (مثلاً: `lakhdar-medical-app`).
    - **مهم**: لا تقم بتحديد خيار إنشاء `README`, `.gitignore`, أو `license`.

4.  **رفع المشروع إلى GitHub باستخدام الطرفية (Terminal)**:
    - افتح الطرفية (Terminal أو Command Prompt) وانتقل إلى مجلد المشروع الذي فككت ضغطه.
    ```bash
    cd path/to/your/project-folder
    ```
    - قم بتنفيذ الأوامر التالية بالترتيب:
    ```bash
    # تهيئة مستودع Git محلي
    git init -b main

    # إضافة جميع الملفات
    git add .

    # عمل الحفظ الأول (commit)
    git commit -m "Initial commit from Firebase Studio"

    # ربط المستودع المحلي بالبعيد (استبدل الرابط برابطك الخاص)
    git remote add origin https://github.com/your-username/your-repo-name.git

    # رفع الكود إلى GitHub
    git push -u origin main
    ```

### الخطوة 2: إعداد قاعدة البيانات

1.  **إنشاء قاعدة البيانات**:
    - قم بتشغيل خادم MySQL.
    - أنشئ قاعدة بيانات جديدة باسم `medical_db` إذا لم تكن موجودة.
    ```sql
    CREATE DATABASE IF NOT EXISTS medical_db;
    ```
    - **اختر قاعدة البيانات التي أنشأتها** لتكون النشطة (في معظم أدوات MySQL، يتم ذلك بالنقر المزدوج على اسمها). أو قم بتنفيذ الأمر:
    ```sql
    USE medical_db;
    ```

2.  **إنشاء الجداول (أو إعادة إنشائها)**:
    - انسخ كتلة الأوامر التالية بالكامل ونفذها في أداة MySQL الخاصة بك. ستقوم هذه الأوامر بحذف الجداول القديمة (إذا كانت موجودة) ثم إنشاء الجداول الجديدة بالهيكل الصحيح.

    ```sql
    -- حذف الجداول إذا كانت موجودة لضمان بداية نظيفة
    DROP TABLE IF EXISTS `forum_comments`;
    DROP TABLE IF EXISTS `forum_posts`;
    DROP TABLE IF EXISTS `appointments`;
    DROP TABLE IF EXISTS `doctors`;
    DROP TABLE IF EXISTS `users`;

    --
    -- جدول المستخدمين (المرضى) `users`
    --
    CREATE TABLE `users` (
      `id` varchar(255) NOT NULL,
      `name` varchar(255) NOT NULL,
      `email` varchar(255) NOT NULL,
      `password` varchar(255) NOT NULL,
      `phoneNumber` varchar(255) DEFAULT NULL,
      `medicalHistory` text,
      `avatarId` varchar(255) DEFAULT NULL,
      `role` enum('patient') NOT NULL DEFAULT 'patient',
       PRIMARY KEY (`id`),
       UNIQUE KEY `email` (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

    --
    -- جدول الأطباء `doctors`
    --
    CREATE TABLE `doctors` (
      `id` varchar(255) NOT NULL,
      `name` varchar(255) NOT NULL,
      `specialization` varchar(255) NOT NULL,
      `licenseNumber` varchar(255) DEFAULT NULL,
      `email` varchar(255) NOT NULL,
      `password` varchar(255) NOT NULL,
      `phoneNumber` varchar(255) DEFAULT NULL,
      `location` varchar(255) DEFAULT NULL,
      `bio` text,
      `imageId` varchar(255) DEFAULT NULL,
      `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
      `availability` json DEFAULT NULL,
      `promotionalImages` json DEFAULT NULL,
      `connections` json DEFAULT NULL,
      `role` enum('doctor') NOT NULL DEFAULT 'doctor',
       PRIMARY KEY (`id`),
       UNIQUE KEY `email` (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

    --
    -- جدول المواعيد `appointments`
    --
    CREATE TABLE `appointments` (
      `id` varchar(255) NOT NULL,
      `doctorId` varchar(255) NOT NULL,
      `patientId` varchar(255) NOT NULL,
      `doctorName` varchar(255) NOT NULL,
      `patientName` varchar(255) NOT NULL,
      `doctorSpecialization` varchar(255) NOT NULL,
      `date` date NOT NULL,
      `time` varchar(255) NOT NULL,
      `status` enum('upcoming','completed','cancelled') NOT NULL DEFAULT 'upcoming',
      `reason` text,
       PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

    --
    -- جدول منشورات المنتدى `forum_posts`
    --
    CREATE TABLE `forum_posts` (
      `id` varchar(255) NOT NULL,
      `title` varchar(255) NOT NULL,
      `content` text NOT NULL,
      `authorId` varchar(255) NOT NULL,
      `authorName` varchar(255) NOT NULL,
      `authorSpecialization` varchar(255) NOT NULL,
      `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

    --
    -- جدول تعليقات المنتدى `forum_comments`
    --
    CREATE TABLE `forum_comments` (
      `id` varchar(255) NOT NULL,
      `postId` varchar(255) NOT NULL,
      `authorId` varchar(255) NOT NULL,
      `authorName` varchar(255) NOT NULL,
      `content` text NOT NULL,
      `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
      KEY `postId` (`postId`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    ```
3. **إضافة بيانات أولية (اختياري)**:
   - لتسهيل الاختبار، يمكنك تنفيذ أوامر SQL التالية لإضافة 4 أطباء و 4 مرضى.
   - **كلمة المرور** لجميع الحسابات هي: `password123`.

   ```sql
    -- مسح الجداول قبل إدخال بيانات جديدة لتجنب الأخطاء
    SET SQL_SAFE_UPDATES = 0;
    TRUNCATE TABLE `doctors`;
    TRUNCATE TABLE `users`;
    SET SQL_SAFE_UPDATES = 1;

    -- كلمة المرور المشفرة لـ 'password123' (متوافقة مع bcryptjs)
    SET @hashed_password = '$2a$10$3i1q7C1y9a7t5B8j6D4c2uX1wZ0e.V1g.H3k.L5p.Q7r.S9i.O2c2';

    -- إدخال بيانات الأطباء
    INSERT INTO `doctors` (`id`, `name`, `specialization`, `licenseNumber`, `email`, `password`, `phoneNumber`, `location`, `bio`, `imageId`, `status`, `availability`, `promotionalImages`, `connections`, `role`) VALUES
    ('doc-1', 'د. أمين صالح', 'طب القلب', 'CL-112233', 'amin.saleh@medical.app', @hashed_password, '555-0101', 'الرياض', 'طبيب قلب بخبرة 20 عامًا في إدارة الحالات المعقدة للقلب.', 'doctor-1', 'approved', '{"2024-09-10": ["09:00", "10:00"], "2024-09-11": ["14:00"]}', '[]', '[]', 'doctor'),
    ('doc-2', 'د. فاطمة الزهراء', 'الأمراض الجلدية', 'DL-445566', 'fatima.zahra@medical.app', @hashed_password, '555-0102', 'جدة', 'متخصصة في الأمراض الجلدية التجميلية والليزر.', 'doctor-2', 'approved', '{}', '[]', '[]', 'doctor'),
    ('doc-3', 'د. يوسف حمدان', 'طب الأطفال', 'PL-778899', 'youssef.hamdan@medical.app', @hashed_password, '555-0103', 'الدمام', 'محبوب من قبل الأطفال وأولياء الأمور لنهجه الودي في الرعاية الصحية.', 'doctor-3', 'approved', '{}', '[]', '[]', 'doctor'),
    ('doc-4', 'د. نورة خالد', 'طب الأعصاب', 'NL-101112', 'noura.khaled@medical.app', @hashed_password, '555-0104', 'مكة', 'خبيرة في تشخيص وعلاج اضطرابات الصداع النصفي والصرع.', 'doctor-4', 'approved', '{}', '[]', '[]', 'doctor');

    -- إدخال بيانات المرضى
    INSERT INTO `users` (`id`, `name`, `email`, `password`, `phoneNumber`, `medicalHistory`, `avatarId`, `role`) VALUES
    ('user-1', 'علي أحمد', 'ali.ahmed@email.com', @hashed_password, '555-0201', 'يعاني من ارتفاع ضغط الدم.', 'user-avatar-1', 'patient'),
    ('user-2', 'سارة محمود', 'sara.mahmoud@email.com', @hashed_password, '555-0202', 'تاريخ من الصداع النصفي.', 'user-avatar-2', 'patient'),
    ('user-3', 'خالد عبد الله', 'khaled.abdullah@email.com', @hashed_password, '555-0203', NULL, 'user-avatar-3', 'patient'),
    ('user-4', 'هند إبراهيم', 'hind.ibrahim@email.com', @hashed_password, '555-0204', 'حساسية من البنسلين.', 'user-avatar-4', 'patient');

   ```


### الخطوة 3: إعداد متغيرات البيئة

1.  **إنشاء ملف `.env`**:
    - في جذر المشروع (نفس مستوى `package.json`)، أنشئ ملفًا جديدًا باسم `.env`.

2.  **إضافة المتغيرات**:
    - انسخ المحتوى التالي في ملف `.env` واملأ الفراغات بمعلوماتك الصحيحة.

    ```env
    # --- متغيرات قاعدة البيانات ---
    # استبدل بالقيم الصحيحة لخادم MySQL الخاص بك
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=medical_db
    DB_PORT=3306

    # --- متغيرات الذكاء الاصطناعي ---
    # استبدل بمفتاح API الخاص بك من Google AI Studio
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

    # --- متغيرات التطبيق ---
    NEXT_PUBLIC_APP_URL=http://localhost:9002
    ```

### الخطوة 4: تثبيت الاعتماديات وتشغيل المشروع

1.  **تثبيت الحزم**:
    - في الطرفية، داخل مجلد المشروع، قم بتشغيل الأمر التالي:
    ```bash
    npm install
    ```

2.  **تشغيل خادم التطوير**:
    - بعد اكتمال التثبيت، قم بتشغيل الأمر التالي:
    ```bash
    npm run dev
    ```

3.  **فتح التطبيق**:
    - افتح متصفحك وانتقل إلى [http://localhost:9002](http://localhost:9002).

- **معلومات تسجيل دخول المسؤول:**
  - **البريد الإلكتروني:** `admin@medical.app`
  - **كلمة المرور:** `admin123`


بهذا يكون المشروع جاهزًا ويعمل بشكل كامل على جهازك المحلي!
