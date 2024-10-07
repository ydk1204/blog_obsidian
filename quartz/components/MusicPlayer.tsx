import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

const MusicPlayer = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={`music-player ${displayClass ?? ""}`}>
      <div id="song-title">재생 준비 중...</div>
      <div id="youtube-player"></div>
      <div class="controls">
        <button id="prev" aria-label="이전 곡">⏮️</button>
        <button id="play-pause" aria-label="재생/일시정지">▶️</button>
        <button id="next" aria-label="다음 곡">⏭️</button>
        <button id="mute" aria-label="음소거">🔊</button>
      </div>
      <input type="range" id="volume-slider" min="0" max="100" value="100" />
    </div>
  )
}

export const musicPlayerScript = `
  let player;
  let isPlayerReady = false;

  function loadYouTubeIframeAPI() {
    return new Promise((resolve, reject) => {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => resolve();
      tag.onerror = (error) => reject('YouTube IFrame API 로드 실패: ' + error);
    });
  }

  async function initPlayer() {
    try {
      await loadYouTubeIframeAPI();
      player = new YT.Player('youtube-player', {
        height: '1',
        width: '1',
        playerVars: {
          listType: 'playlist',
          list: 'PLYFc8Rzrb-kVlEDLj0FiiWhGpsNbLNcF8',
          autoplay: 0,
          playsinline: 1,
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
          'onError': onPlayerError
        }
      });
    } catch (error) {
      console.error('플레이어 초기화 실패:', error);
      document.getElementById('song-title').textContent = '플레이어 로드 실패';
    }
  }

  function onPlayerReady(event) {
    console.log('YouTube player is ready');
    isPlayerReady = true;
    setupControls();
    updateSongTitle();
    setupVolumeSlider();
  }

  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
      updateSongTitle();
      document.getElementById('play-pause').textContent = '⏸️';
    } else if (event.data == YT.PlayerState.PAUSED) {
      document.getElementById('play-pause').textContent = '▶️';
    }
  }

  function onPlayerError(event) {
    console.error('YouTube player error:', event.data);
    document.getElementById('song-title').textContent = '오류 발생: 재생할 수 없습니다';
  }

  function updateSongTitle() {
    if (isPlayerReady && player.getVideoData) {
      const songTitle = player.getVideoData().title;
      document.getElementById('song-title').textContent = songTitle || '재생 중인 곡 없음';
    }
  }

  function setupControls() {
    const playPauseBtn = document.getElementById('play-pause');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const muteBtn = document.getElementById('mute');

    playPauseBtn.addEventListener('click', function() {
      if (!isPlayerReady) return;
      if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
      } else {
        player.playVideo().catch(e => console.error('재생 오류:', e));
      }
    });

    nextBtn.addEventListener('click', function() {
      if (isPlayerReady) player.nextVideo();
    });

    prevBtn.addEventListener('click', function() {
      if (isPlayerReady) player.previousVideo();
    });

    muteBtn.addEventListener('click', function() {
      if (!isPlayerReady) return;
      if (player.isMuted()) {
        player.unMute();
        muteBtn.textContent = '🔊';
      } else {
        player.mute();
        muteBtn.textContent = '🔇';
      }
    });
  }

  function setupVolumeSlider() {
    const volumeSlider = document.getElementById('volume-slider');
    if (isMobile()) {
      volumeSlider.style.display = 'none';
    } else {
      volumeSlider.style.display = 'block';
      volumeSlider.addEventListener('input', function() {
        if (isPlayerReady) player.setVolume(this.value);
      });
    }
  }

  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  initPlayer();

  // 모바일에서 사용자 상호작용 후 재생 시도
  document.addEventListener('DOMContentLoaded', function() {
    const playPauseBtn = document.getElementById('play-pause');
    playPauseBtn.addEventListener('click', function initializePlayer() {
      if (isPlayerReady && player && typeof player.playVideo === 'function') {
        player.playVideo().catch(e => console.error('재생 오류:', e));
        playPauseBtn.removeEventListener('click', initializePlayer);
      }
    });
  });
`

MusicPlayer.afterDOMLoaded = musicPlayerScript

export default (() => MusicPlayer) satisfies QuartzComponentConstructor