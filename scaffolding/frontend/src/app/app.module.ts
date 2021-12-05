import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoItemComponent } from './todo-list/todo-item/todo-item.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserComponent } from './user/user.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ProfileComponent } from './user/profile/profile.component';
import { AppRoutingModule } from './app-routing.module';
import { BoardComponent } from './board/board.component';
import { PostComponent } from './board/post/post.component';
import { MatIconModule } from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatOptionModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { ShopComponent } from './shop/shop.component';
import { ProductComponent } from './shop/product/product.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardComponent } from './adminDashboard/adminDashboard.component';
import { MatGridListModule } from "@angular/material/grid-list";


@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    UserComponent,
    ProfileComponent,
    BoardComponent,
    PostComponent,
    ShopComponent,
    ProductComponent,
    DashboardComponent,
    AdminDashboardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    FormsModule,
    MatCheckboxModule,
    AppRoutingModule,
    MatIconModule,
    MatSidenavModule,
    MatOptionModule,
    MatSelectModule,
    MatGridListModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
