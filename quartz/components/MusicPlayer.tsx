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
  let lastVolume = 100;
  let isMobile = false;

  function checkMobile() {
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log('Is mobile:', isMobile);
  }

  function initializePlayer() {
    checkMobile();
    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
      window.onYouTubeIframeAPIReady = () => {
        console.log("YouTube API is ready");
        createYouTubePlayer();
      };
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      console.log("YouTube API is already loaded");
      createYouTubePlayer();
    }
  }

  function createYouTubePlayer() {
    player = new YT.Player('youtube-player', {
      height: '1',
      width: '1',
      playerVars: {
        listType: 'playlist',
        list: 'PLYFc8Rzrb-kVlTimvI-DT6XhoV4fZ9np3',
        autoplay: 0,
        playsinline: 1,
        controls: isMobile ? 1 : 0,
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

    player.loadPlaylist({
      list: 'PLYFc8Rzrb-kVlTimvI-DT6XhoV4fZ9np3',
      listType: 'playlist',
      index: 0,
      startSeconds: 0
    });

    console.log('플레이리스트 로드 시도');

    setTimeout(() => {
      if (player && player.getPlaylist && player.getPlaylistIndex) {
        const playlist = player.getPlaylist();
        const currentIndex = player.getPlaylistIndex();
        console.log('Playlist:', playlist ? playlist : 'Not available');
        console.log('Current index:', currentIndex !== undefined ? currentIndex : 'Not available');
      }
    }, 2000);

    setupControls();
    updateSongTitle();
    setupVolumeSlider();
    restorePlayerState();
    updatePlayerTheme();
    updateMuteButton();
  }

  function onPlayerStateChange(event) {
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    if (event.data == YT.PlayerState.PLAYING) {
      updateSongTitle();
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'inline';
      console.log('현재 재생 중인 곡 인덱스:', player.getPlaylistIndex());
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
    prevButton.addEventListener('click', () => {
      console.log('이전 곡 버튼 클릭');
      playPreviousTrack();
    });
    nextButton.addEventListener('click', () => {
      console.log('다음 곡 버튼 클릭');
      playNextTrack();
    });
    muteButton.addEventListener('click', () => {
      console.log('음소거 버튼 클릭');
      toggleMute();
    });
  }

  function togglePlayPause() {
    if (isPlayerReady && player) {
      const state = player.getPlayerState();
      if (state === YT.PlayerState.PLAYING) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setTimeout(updatePlayPauseButton, 100);
    }
  }

  function updatePlayPauseButton() {
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    if (isPlayerReady && player) {
      const state = player.getPlayerState();
      if (state === YT.PlayerState.PLAYING) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'inline';
      } else {
        playIcon.style.display = 'inline';
        pauseIcon.style.display = 'none';
      }
    }
  }

  function playNextTrack() {
    if (isPlayerReady && player && player.nextVideo) {
      player.nextVideo();
      console.log('다음 곡으로 이동');
      setTimeout(() => {
        updateSongTitle();
        updatePlayPauseButton();
      }, 1000);
    } else {
      console.log('다음 곡 재생 실패');
    }
  }

  function playPreviousTrack() {
    if (isPlayerReady && player && player.previousVideo) {
      player.previousVideo();
      console.log('이전 곡으로 이동');
      setTimeout(() => {
        updateSongTitle();
        updatePlayPauseButton();
      }, 1000);
    } else {
      console.log('이전 곡 재생 실패');
    }
  }

  function updateMuteButton() {
    const volumeIcon = document.getElementById('volume-icon');
    const muteIcon = document.getElementById('mute-icon');
    const volumeSlider = document.getElementById('volume-slider');
    if (isPlayerReady && player && player.isMuted && player.getVolume) {
      const isMuted = player.isMuted() || player.getVolume() === 0;
      console.log('Mute status:', isMuted, 'Volume:', player.getVolume());
      volumeIcon.style.display = isMuted ? 'none' : 'inline';
      muteIcon.style.display = isMuted ? 'inline' : 'none';
      volumeSlider.value = isMuted ? '0' : player.getVolume().toString();
    }
  }

  function toggleMute() {
    if (isPlayerReady && player && player.isMuted && player.unMute && player.mute && player.setVolume && player.getVolume) {
      const currentlyMuted = player.isMuted() || player.getVolume() === 0;
      console.log('Current mute status:', currentlyMuted);
      if (currentlyMuted) {
        player.unMute();
        player.setVolume(lastVolume || 50);
        console.log('Unmuting, setting volume to:', lastVolume || 50);
      } else {
        lastVolume = player.getVolume();
        player.mute();
        console.log('Muting, last volume was:', lastVolume);
      }
      setTimeout(() => {
        updateMuteButton();
        console.log('After toggle - Muted:', player.isMuted(), 'Volume:', player.getVolume());
      }, 100);
    }
  }

  function updateSongTitle() {
    if (isPlayerReady && player && player.getVideoData) {
      const videoData = player.getVideoData();
      const songTitle = videoData && videoData.title ? videoData.title : '재생 준비 중...';
      document.getElementById('song-title').textContent = songTitle;
    }
  }

  function setupVolumeSlider() {
    const volumeSlider = document.getElementById('volume-slider');
    volumeSlider.addEventListener('input', function() {
      if (isPlayerReady && player && player.setVolume && player.unMute) {
        const volume = parseInt(this.value);
        player.setVolume(volume);
        if (volume > 0) {
          player.unMute();
          lastVolume = volume;
        } else {
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

  document.addEventListener('click', function() {
    if (isPlayerReady && player && player.playVideo) {
      player.playVideo().then(() => {
        console.log('재생 시작');
        updatePlayPauseButton();
        updateSongTitle();
      }).catch(function(e) {
        console.error('재생 오류:', e);
      });
    }
  }, { once: true, capture: true });

  initializePlayer();
`

export default (() => MusicPlayer) satisfies QuartzComponentConstructor