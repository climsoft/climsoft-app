import { AppMode } from './../../../data/enum/app-mode';
import { environment } from 'src/environments/environment';
import { SplashAnimationType } from './../../../data/enum/splash-animation-type';
import { Component, OnInit, Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {
  windowWidth!: string;
  splashTransition!: string;
  opacityChange: number = 1;
  showSplash = true;

  constructor(private cookieService: CookieService) {}

  @Input() animationDuration: number = 0.5;
  @Input() duration: number = 3;
  @Input() animationType: SplashAnimationType = SplashAnimationType.SlideLeft;

  get isClimsoft(): boolean {
    return +this.cookieService.get(environment.APP_MODE_COOKIE) === AppMode.CLIMSOFT || false;
  }

  ngOnInit(): void {
    setTimeout(() => {
      let transitionStyle = "";
      switch (this.animationType) {
        case SplashAnimationType.SlideLeft:
          this.windowWidth = "-" + window.innerWidth + "px";
          transitionStyle = "left " + this.animationDuration + "s";
          break;
        case SplashAnimationType.SlideRight:
          this.windowWidth = window.innerWidth + "px";
          transitionStyle = "left " + this.animationDuration + "s";
          break;
        case SplashAnimationType.FadeOut:
          transitionStyle = "opacity " + this.animationDuration + "s";
          this.opacityChange = 0;
      }

      this.splashTransition = transitionStyle;

      setTimeout(() => {
        this.showSplash = !this.showSplash;
      }, this.animationDuration * 500);
    }, this.duration * 1000);
  }
}
