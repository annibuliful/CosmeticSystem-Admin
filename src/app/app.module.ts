import { routing } from './app.routing';
import { ApolloModule } from 'apollo-angular';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Client } from './apolloClient';
import { FormsModule } from '@angular/forms';
import { NgUploaderModule } from 'ngx-uploader';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { AppComponent } from './app.component';
import { IndexComponent } from './Components/index/index.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { MainComponent } from './Components/main/main.component';
import { ProductsComponent } from './Components/products/products.component';
import { ContentsComponent } from './Components/contents/contents.component';
import { ListProductsComponent } from './Components/list-products/list-products.component';
import { ListArticlesComponent } from './Components/list-articles/list-articles.component';
import { CreateArticleComponent } from './Components/create-article/create-article.component';
import { EditArticleComponent } from './Components/edit-article/edit-article.component';
import { CreateProductComponent } from './Components/create-product/create-product.component';
import { EditProductComponent } from './Components/edit-product/edit-product.component';
import { CreateCategoryComponent } from './Components/create-category/create-category.component';
import { ListCategorysComponent } from './Components/list-categorys/list-categorys.component';
@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    NavbarComponent,
    MainComponent,
    ProductsComponent,
    ContentsComponent,
    ListProductsComponent,
    ListArticlesComponent,
    CreateArticleComponent,
    EditArticleComponent,
    CreateProductComponent,
    EditProductComponent,
    CreateCategoryComponent,
    ListCategorysComponent
  ],
  imports: [
    BrowserModule,
    ApolloModule.forRoot(Client),
    routing,
    FormsModule,
    NgUploaderModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
