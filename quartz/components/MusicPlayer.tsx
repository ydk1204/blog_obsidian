import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function MusicPlayer({ displayClass }: QuartzComponentProps) {
  return (
    <div class={`music-player ${displayClass ?? ""}`}>
      <div id="song-title" class="song-title">재생 준비 중...</div>
      <div id="youtube-player"></div>
      <div class="controls-container">
        <div class="controls">
          <button id="prev" aria-label="이전 곡">
            <img src="/static/img/forward.png" alt="이전 곡" style="transform: scaleX(-1)" />
          </button>
          <button id="play-pause" aria-label="재생/일시정지">
            <img id="play-icon" src="/static/img/play.png" alt="재생" />
            <img id="pause-icon" src="/static/img/pause.png" alt="일시정지" style="display: none" />
          </button>
          <button id="next" aria-label="다음 곡">
            <img src="/static/img/forward.png" alt="다음 곡" />
          </button>
          <button id="mute" aria-label="음소거">
            <img id="volume-icon" src="/static/img/volume.png" alt="음량" />
            <img id="mute-icon" src="/static/img/mute.png" alt="음소거" style="display: none" />
          </button>
        </div>
        <input type="range" id="volume-slider" min="0" max="100" value="100" />
      </div>
    </div>
  )
}

MusicPlayer.afterDOMLoaded = `
  if (typeof window.YT === 'undefined' || typeof window.YT.Player === 'undefined') {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  window.onYouTubeIframeAPIReady = function() {
    if (!window.player) {
      window.player = new YT.Player('youtube-player', {
        height: '1',
        width: '1',
        playerVars: {
          listType: 'playlist',
          list: 'PLYFc8Rzrb-kVlTimvI-DT6XhoV4fZ9np3',
          autoplay: 0,
          playsinline: 1,
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
          'onError': onPlayerError
        }
      });
    } else {
      setupControls();
      updateSongTitle();
      setupVolumeSlider();
    }
  }

  function onPlayerReady(event) {
    console.log('YouTube player is ready');
    setupControls();
    updateSongTitle();
    setupVolumeSlider();
  }

  function onPlayerStateChange(event) {
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    if (event.data == YT.PlayerState.PLAYING) {
      updateSongTitle();
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'inline';
    } else if (event.data == YT.PlayerState.PAUSED) {
      playIcon.style.display = 'inline';
      pauseIcon.style.display = 'none';
    }
  }

  function onPlayerError(event) {
    console.error('YouTube player error:', event.data);
    document.getElementById('song-title').textContent = '오류 발생: 재생할 수 없습니다';
  }

  function updateSongTitle() {
    if (window.player && window.player.getVideoData) {
      const songTitle = window.player.getVideoData().title;
      document.getElementById('song-title').textContent = songTitle || '재생 중인 곡 없음';
    }
  }

  function setupControls() {
    const playPauseBtn = document.getElementById('play-pause');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const muteBtn = document.getElementById('mute');
    const volumeIcon = document.getElementById('volume-icon');
    const muteIcon = document.getElementById('mute-icon');

    playPauseBtn.addEventListener('click', function() {
      if (!window.player) return;
      if (window.player.getPlayerState() === YT.PlayerState.PLAYING) {
        window.player.pauseVideo();
      } else {
        window.player.playVideo().catch(e => console.error('재생 오류:', e));
      }
    });

    nextBtn.addEventListener('click', function() {
      if (window.player) window.player.nextVideo();
    });

    prevBtn.addEventListener('click', function() {
      if (window.player) window.player.previousVideo();
    });

    muteBtn.addEventListener('click', function() {
      if (!window.player) return;
      if (window.player.isMuted()) {
        window.player.unMute();
        volumeIcon.style.display = 'inline';
        muteIcon.style.display = 'none';
      } else {
        window.player.mute();
        volumeIcon.style.display = 'none';
        muteIcon.style.display = 'inline';
      }
    });
  }

  function setupVolumeSlider() {
    const volumeSlider = document.getElementById('volume-slider');
    const volumeIcon = document.getElementById('volume-icon');
    const muteIcon = document.getElementById('mute-icon');
    if (isMobile()) {
      volumeSlider.style.display = 'none';
    } else {
      volumeSlider.style.display = 'block';
      volumeSlider.addEventListener('input', function() {
        if (window.player) {
          window.player.setVolume(this.value);
          window.player.unMute();
          volumeIcon.style.display = 'inline';
          muteIcon.style.display = 'none';
        }
      });
    }
  }

  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // 다크 모드 감지 및 이미지 색상 변경
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const changeImageColor = (isDarkMode) => {
    const images = document.querySelectorAll('.music-player img');
    images.forEach(img => {
      img.style.filter = isDarkMode ? 'invert(1)' : 'invert(0.1)';
    });
  };

  // 페이지 로드 시 즉시 이미지 색상 변경
  changeImageColor(document.documentElement.getAttribute('saved-theme') === 'dark');

  // 시스템 테마 변경 감지
  darkModeMediaQuery.addListener((e) => changeImageColor(e.matches));

  // Quartz의 테마 변경 이벤트 리스너
  document.addEventListener('themechange', (e) => {
    changeImageColor(e.detail.theme === 'dark');
  });

  if (window.YT && window.YT.Player) {
    window.onYouTubeIframeAPIReady();
  }
`

export default (() => MusicPlayer) satisfies QuartzComponentConstructor