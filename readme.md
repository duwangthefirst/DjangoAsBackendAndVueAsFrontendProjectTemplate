## Django(Backend) + Vue3(Frontend) Project Template

### Project Structure

after all steps finished, the project structure is expected to be like:

```text
- project_root_dir/
    - backend/  （for django）
    - frontend/  （for vue3 & vite）
```

let's get started by:

```bash
mkdir project_root_dir
```

### Backend Configuration

create django project:

```bash
cd path/to/project_root_dir

mkdir backend && cd backend

# create venv:
python3 -m venv ./venv
# activate venv for macos:
source ./venv/bin/activate
# activate venv for windows:
# just run ./venv/bin/activate.bat (I forget the specific command)

# install django:
pip install django

# create new django project (or copy existing one)
django-admin startproject django_project .
# common django command:
#python manage.py makemigrations
#python manage.py migrate
#python manage.py createsuperuser
#python manage.py collectstatic (run this command after `npm run build`)
```

edit `backend/django_project/settings.py`:

```python
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# ...

# templates dir configuration
TEMPLATES = [
    {
        # ...
        'DIRS': [
            BASE_DIR / 'templates',
        ],
        # ...
    },
]

# ...

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'
STATICFILES_DIRS = ['staticfiles', ]
STATIC_ROOT = 'static/'

# ...
```

edit `backend/django_project/urls.py`:

```python
from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    # add this route for vue's index.html (this file will be generated later)
    path('vue/', TemplateView.as_view(template_name='vue_index.html')),
]
```

run django dev server to check if everything is fine:

```bash
python manage.py runserver
```

### Frontend Configuration

```bash
cd path/to/project_root_dir

mkdir frontend && cd frontend

# create new vue3 project (or copy existing one):
npm init vue@latest --directory ./
# only with router checked

# install necessary dependencies for dev env
npm install npm-run-all del-cli move-file-cli --save-dev
```

edit `frontend/src/router/index.js`: (replace `createWebHistory(...)` with `createWebHashHistory()` in order to use route like this way: http://127.0.0.1:8000/vue/#/about )

```javascript
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
```

edit `frontend/vite.config.js`:

```javascript
import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    // add the following for integration with django
    publicDir: "../backend/staticfiles/frontend",
    build: {
        emptyOutDir: false,
        rollupOptions: {
            output: {
                dir: "../backend/staticfiles/frontend"
            }
        }
    }
})
```

edit `frontend/package.json`:

```json
{
  "name": "frontend",
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "preview": "vite preview --port 4173",

    "build": "run-s build::prepare build::build build::moveindex build:clean",
    "build:prepare": "del ../backend/staticfiles/frontend/assets/* ../backend/templates/index.html --force",
    "build:build": "vite build --base=/static/frontend/",
    "build:moveindex": "move-file ../backend/staticfiles/frontend/index.html ../backend/templates/vue_index.html",
    "build:clean": "del ./dist"
  },
  "dependencies": {
    "vue": "^3.2.38",
    "vue-router": "^4.1.5"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^3.0.3",
    "del-cli": "^5.0.0",
    "move-file-cli": "^3.0.0",
    "npm-run-all": "^4.1.5",
    "vite": "^3.0.9"
  }
}
```

es6 to es5, bundle, and get static files for deploy:

```bash
npm run build
```

the result static files should be in:

- `backend/static/frontend/`
- `backend/templates/index.html`

do not forget to run:

```bash
cd backend
python manage.py collectstatic

python manage.py runserver
```

and you should be able to see your vue staff after go to: http://127.0.0.1:8000/vue/

