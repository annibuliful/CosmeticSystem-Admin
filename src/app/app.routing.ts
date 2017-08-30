import { CreateArticleComponent } from './Components/create-article/create-article.component';
import { ListArticlesComponent } from './Components/list-articles/list-articles.component';
import { ListProductsComponent } from './Components/list-products/list-products.component';
import { ContentsComponent } from './Components/contents/contents.component';
import { ProductsComponent } from './Components/products/products.component';
import { MainComponent } from './Components/main/main.component';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from "./Components/index/index.component";

const routes: Routes = [
  {path:'' , component: IndexComponent},
  {path:'main' , component: MainComponent},
  {path:'products' , component: ProductsComponent},
  {path:'contents' , component: ContentsComponent},
  {path:'listproducts/:category' , component: ListProductsComponent},
  {path:'listarticles/:category' , component: ListArticlesComponent},
  {path: 'createarticle' , component: CreateArticleComponent}
]

export const routing = RouterModule.forRoot(routes);
