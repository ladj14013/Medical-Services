# دليل رفع المشروع إلى GitHub

اتبع هذه الخطوات لنقل مشروعك من Firebase Studio إلى مستودع GitHub خاص بك.

### الخطوة 1: تنزيل المشروع من Firebase Studio (مهم جدًا)

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

بهذا يكون مشروعك قد تم رفعه بنجاح إلى GitHub.