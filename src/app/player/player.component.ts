import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  @Input() clip;
  @Input() nextClip;
  @Input() prevClip;
  @Input() playNextClip;

  currentTime = 0;
  playing = true;
  muted = true;
  seeking = false;

  toggleMute() {
    this.muted = !this.muted;
    this.myVideo.nativeElement.muted = this.muted;
  }

  resetClip() {
    console.log("resetting")
    this.currentTime = 0; 
    this.playing = true;
    this.seeking = false;
    this.seekBar.nativeElement.value = 0;
  }

  play() {
    if (!this.seeking) {
      if (!this.playing) {
        this.myVideo.nativeElement.play();
        this.playing = true;
      } else {
        this.myVideo.nativeElement.pause();
        this.playing = false;
      }
    }
  }

  constructor(public sanitizer: DomSanitizer) {}
  @ViewChild('myVideo') myVideo: ElementRef;
  @ViewChild('seekBar') seekBar: ElementRef;

  ngOnInit() {
    this.seekBar.nativeElement.value = 0;
    this.myVideo.nativeElement.muted = this.muted;

    function handleTimeUpdate() {
      this.currentTime = (100 / this.myVideo.nativeElement.duration) * this.myVideo.nativeElement.currentTime;
      this.seekBar.nativeElement.value = this.currentTime;
    }

    function handleSeekChange() {
      this.currentTime =  this.seekBar.nativeElement.value;
      this.myVideo.nativeElement.currentTime = this.myVideo.nativeElement.duration * (this.currentTime / 100);
      this.seekBar.nativeElement.value = this.currentTime;
    }

    function handleSeekMouseUp() {
      if (this.playing) {
        this.myVideo.nativeElement.play();
      }
      this.seeking = false;
    }

    function handleSeekMouseDown() {
      if (this.playing) {
        this.myVideo.nativeElement.pause();
      }
      this.seeking = true;
    }

    function handleVideoEnded() {
      this.playNextClip();
    }

    this.myVideo.nativeElement.addEventListener("timeupdate", handleTimeUpdate.bind(this));
    this.myVideo.nativeElement.addEventListener("ended", handleVideoEnded.bind(this));
    this.seekBar.nativeElement.addEventListener("change", handleSeekChange.bind(this));
    this.seekBar.nativeElement.addEventListener("mousedown", handleSeekMouseDown.bind(this));
    this.seekBar.nativeElement.addEventListener("mouseup", handleSeekMouseUp.bind(this));
  }

  ngOnChanges(changes) {
    if (changes.clip) {
      this.resetClip();
    }
  }

}
