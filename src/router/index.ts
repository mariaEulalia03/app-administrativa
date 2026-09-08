import { createRouter, createWebHistory } from 'vue-router'

import ProductorInlineView from '../views/Productor/Productor_Inline.vue'
import ProductorDetailView from '../views/Productor/Productor_Detail.vue'
import ProductorFormView from '../views/Productor/Productor_Form.vue'
import AsociacionInlineView from '../views/Asociacion/Asociacion_Inline.vue'
import AsociacionDetailView from '../views/Asociacion/Asociacion_Detail.vue'
import AsociacionFormView from '../views/Asociacion/Asociacion_Form.vue'
import RedInlineView from '../views/Red/Red_Inline.vue'
import RedDetailView from '../views/Red/Red_Detail.vue'
import RedFormView from '../views/Red/Red_Form.vue'
import FeriaInlineView from '../views/FeriaAgroecologica/FeriaAgroecologica_Inline.vue'
import FeriaDetailView from '../views/FeriaAgroecologica/FeriaAgroecologica_Detail.vue'
import FeriaFormView from '../views/FeriaAgroecologica/FeriaAgroecologica_Form.vue'

import AgroecosistemaDetailView from '../views/Agroecosistema/Agroecosistema_Detail.vue'
import AgroecosistemaFormView from '../views/Agroecosistema/Agroecosistema_Form.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/productores'
    },
    {
      path: '/productores',
      name: 'productores',
      component: ProductorInlineView
    },
    {
      path: '/productores/nuevo',
      name: 'productores-new',
      component: ProductorFormView
    },
    {
      path: '/productores/:id/editar',
      name: 'productores-edit',
      component: ProductorFormView
    },
    {
      path: '/productores/:id',
      name: 'productores-detail',
      component: ProductorDetailView
    },
    {
      path: '/asociaciones',
      name: 'asociaciones',
      component: AsociacionInlineView
    },
    {
      path: '/asociaciones/nuevo',
      name: 'asociaciones-new',
      component: AsociacionFormView
    },
    {
      path: '/asociaciones/:id/editar',
      name: 'asociaciones-edit',
      component: AsociacionFormView
    },
    {
      path: '/asociaciones/:id',
      name: 'asociaciones-detail',
      component: AsociacionDetailView
    },
    {
      path: '/redes',
      name: 'redes',
      component: RedInlineView
    },
    {
      path: '/redes/nuevo',
      name: 'redes-new',
      component: RedFormView
    },
    {
      path: '/redes/:id/editar',
      name: 'redes-edit',
      component: RedFormView
    },
    {
      path: '/redes/:id',
      name: 'redes-detail',
      component: RedDetailView
    },
    {
      path: '/ferias',
      name: 'ferias',
      component: FeriaInlineView
    },
    {
      path: '/ferias/nuevo',
      name: 'ferias-new',
      component: FeriaFormView
    },
    {
      path: '/ferias/:id/editar',
      name: 'ferias-edit',
      component: FeriaFormView
    },
    {
      path: '/ferias/:id',
      name: 'ferias-detail',
      component: FeriaDetailView
    },
    {
      path: '/productores/:id/agroecosistema',
      name: 'productores-agroecosistema-detail',
      component: AgroecosistemaDetailView
    },
    {
      path: '/productores/:id/agroecosistema/editar',
      name: 'productores-agroecosistema-edit',
      component: AgroecosistemaFormView
    },
    {
      path: '/direccion/:id',
      name: 'direccion-detail',
      component: () => import('../views/Direccion/Direccion_Detail.vue')
    }
  ]
})

export default router
