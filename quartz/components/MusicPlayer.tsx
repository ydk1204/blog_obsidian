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
  let player;
  let isPlayerReady = false;

  function initializePlayer() {
    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
      window.onYouTubeIframeAPIReady = () => {
        console.log("YouTube API is ready");
        onYouTubeIframeAPIReady();
      };
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      console.log("YouTube API is already loaded");
      onYouTubeIframeAPIReady();
    }
  }

  function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
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
  }

  function onPlayerReady(event) {
    console.log('YouTube player is ready');
    isPlayerReady = true;
    setupControls();
    updateSongTitle();
    setupVolumeSlider();
    restorePlayerState();
    updatePlayerTheme();
  }

  function onPlayerStateChange(event) {
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    if (event.data == YT.PlayerState.PLAYING) {
      updateSongTitle();
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'inline';
    } else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
      playIcon.style.display = 'inline';
      pauseIcon.style.display = 'none';
    }
    updateMuteButton();
    savePlayerState();
  }

  function onPlayerError(event) {
    console.error('YouTube player error:', event.data);
  }

  function setupControls() {
    const playPauseButton = document.getElementById('play-pause');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const muteButton = document.getElementById('mute');

    playPauseButton.addEventListener('click', togglePlayPause);
    prevButton.addEventListener('click', playPreviousTrack);
    nextButton.addEventListener('click', playNextTrack);
    muteButton.addEventListener('click', toggleMute);
  }

  function togglePlayPause() {
    if (player && player.getPlayerState) {
      if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  }

  function playNextTrack() {
    if (player && player.nextVideo) {
      player.nextVideo();
      setTimeout(updateSongTitle, 1000);
    }
  }

  function playPreviousTrack() {
    if (player && player.previousVideo) {
      player.previousVideo();
      setTimeout(updateSongTitle, 1000);
    }
  }

  function toggleMute() {
    if (player && player.isMuted && player.unMute && player.mute && player.getVolume && player.setVolume) {
      if (player.isMuted() || player.getVolume() === 0) {
        player.unMute();
        player.setVolume(100);
      } else {
        player.mute();
      }
      updateMuteButton();
    }
  }

  function updateMuteButton() {
    const volumeIcon = document.getElementById('volume-icon');
    const muteIcon = document.getElementById('mute-icon');
    const volumeSlider = document.getElementById('volume-slider');
    if (player && player.isMuted && player.getVolume) {
      const isMuted = player.isMuted() || player.getVolume() === 0;
      volumeIcon.style.display = isMuted ? 'none' : 'inline';
      muteIcon.style.display = isMuted ? 'inline' : 'none';
      volumeSlider.value = isMuted ? '0' : player.getVolume().toString();
    }
  }

  function updateSongTitle() {
    if (player && player.getVideoData) {
      const videoData = player.getVideoData();
      const songTitle = videoData && videoData.title ? videoData.title : '재생 준비 중...';
      document.getElementById('song-title').textContent = songTitle;
    }
  }

  function setupVolumeSlider() {
    const volumeSlider = document.getElementById('volume-slider');
    volumeSlider.addEventListener('input', function() {
      if (player && player.setVolume) {
        const volume = parseInt(this.value);
        player.setVolume(volume);
        if (volume > 0 && player.unMute) {
          player.unMute();
        } else if (volume === 0 && player.mute) {
          player.mute();
        }
        updateMuteButton();
      }
    });
  }

  function savePlayerState() {
    if (isPlayerReady && player && player.getVideoData && player.getCurrentTime && player.getPlayerState && player.getVolume && player.isMuted) {
      const state = {
        videoId: player.getVideoData().video_id,
        currentTime: player.getCurrentTime(),
        isPlaying: player.getPlayerState() === YT.PlayerState.PLAYING,
        volume: player.getVolume(),
        isMuted: player.isMuted()
      };
      localStorage.setItem('youtubePlayerState', JSON.stringify(state));
    }
  }

  function restorePlayerState() {
    const savedState = JSON.parse(localStorage.getItem('youtubePlayerState'));
    if (savedState && isPlayerReady && player) {
      player.loadVideoById(savedState.videoId, savedState.currentTime);
      if (savedState.isPlaying) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
      player.setVolume(savedState.volume);
      if (savedState.isMuted) {
        player.mute();
      } else {
        player.unMute();
      }
      updateSongTitle();
      updateMuteButton();
    }
  }

  function updatePlayerTheme() {
    const theme = document.documentElement.getAttribute('saved-theme');
    const musicPlayer = document.querySelector('.music-player');
    if (musicPlayer) {
      musicPlayer.setAttribute('data-theme', theme);
    }
    updateButtonColors(theme);
  }

  function updateButtonColors(theme) {
    const buttons = document.querySelectorAll('.music-player button img');
    buttons.forEach(img => {
      if (theme === 'dark') {
        img.style.filter = 'invert(1)';
      } else {
        img.style.filter = 'none';
      }
    });
  }

  document.addEventListener('themechange', updatePlayerTheme);

  document.addEventListener('nav', function(event) {
    savePlayerState();
    setTimeout(() => {
      const newPlayer = document.getElementById('youtube-player');
      if (newPlayer && !newPlayer.contentWindow) {
        initializePlayer();
      } else {
        restorePlayerState();
      }
      updatePlayerTheme();
    }, 100);
  });

  // 모바일 기기에서의 재생 문제 해결을 위한 코드
  document.addEventListener('click', function() {
    if (isPlayerReady && player && player.playVideo) {
      player.playVideo().catch(function(e) {
        console.error('재생 오류:', e);
      });
    }
  }, { once: true, capture: true });

  initializePlayer();
`

export default (() => MusicPlayer) satisfies QuartzComponentConstructor