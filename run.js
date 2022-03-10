$(function () {
	var playerTrack = $("#player-track"),
		albumName = $("#album-name"),
		trackName = $("#track-name"),
		albumArt = $("#album-art"),
		sArea = $("#s-area"),
		seekBar = $("#seek-bar"),
		trackTime = $("#track-time"),
		insTime = $("#ins-time"),
		sHover = $("#s-hover"),
		playPauseButton = $("#play-pause-button"),
		i = playPauseButton.find("i"),
		tProgress = $("#current-time"),
		tTime = $("#track-length"),
		seekT,
		seekLoc,
		seekBarPos,
		cM,
		ctMinutes,
		ctSeconds,
		curMinutes,
		curSeconds,
		durMinutes,
		durSeconds,
		playProgress,
		bTime,
		nTime = 0,
		buffInterval = null,
		tFlag = false,
		albums = [
			"Satellite",
			"Stay with me",
			"어떤 우울이 우리를 흔들겠어요",
			"긴긴밤",
			"Dear Cloud",
			"비행운",
			"Ophelia",
			"부러운 사람",
			"낭만 젊은 사랑",
			"야작시",
			"강변북로",
			"야간비행",
			"너무아픈사랑은 사랑이 나이었음을",
			"나무",
			"12:45",
			"407",
			"돌덩이",
		],
		trackNames = [
			"수지(Suzy)",
			"자우림",
			"유라",
			"블루파프리카",
			"혜울",
			"문문",
			"심규선",
			"박소은",
			"이세계",
			"적재",
			"황인욱",
			"백예린",
			"로엘",
			"김하연",
			"Etham",
			"남경운",
			"하현우",
		],
		albumArtworks = ["_1", "_2", "_3", "_4", "_5","_6", "_7", "_8", "_9","_10","_11","_12","_13","_14","_15","_16","_17"],
		trackUrl = [
			"https://raw.githubusercontent.com/sgyeong97/music_player/main/1.mp3",
			"https://raw.githubusercontent.com/sgyeong97/music_player/main/2.mp3",
			"https://raw.githubusercontent.com/sgyeong97/music_player/main/3.mp3",
			"https://raw.githubusercontent.com/sgyeong97/music_player/main/4.mp3",
			"https://raw.githubusercontent.com/sgyeong97/music_player/main/5.mp3",
			"https://raw.githubusercontent.com/sgyeong97/music_player/main/6.mp3",
			"https://raw.githubusercontent.com/sgyeong97/music_player/main/7.mp3",
			"https://raw.githubusercontent.com/sgyeong97/music_player/main/8.mp3",
			"https://raw.githubusercontent.com/sgyeong97/music_player/main/9.mp3",
			"https://raw.githubusercontent.com/sgyeong97/music_player/main/10.mp3",
			"https://raw.githubusercontent.com/sgyeong97/music_player/main/11.mp3",
			"https://raw.githubusercontent.com/sgyeong97/music_player/main/12.mp3",
			"https://raw.githubusercontent.com/sgyeong97/music_player/main/13.mp3",
			"https://raw.githubusercontent.com/sgyeong97/music_player/main/14.mp3",
			"https://raw.githubusercontent.com/sgyeong97/music_player/main/15.mp3",
			"https://raw.githubusercontent.com/sgyeong97/music_player/main/16.mp3",
			"https://raw.githubusercontent.com/sgyeong97/music_player/main/17.mp3",
		],
		playPreviousTrackButton = $("#play-previous"),
		playNextTrackButton = $("#play-next"),
		currIndex = -1;

	function playPause() {
		setTimeout(function () {
			if (audio.paused) {
				playerTrack.addClass("active");
				albumArt.addClass("active");
				checkBuffering();
				i.attr("class", "fas fa-pause");
				audio.play();
			} else {
				playerTrack.removeClass("active");
				albumArt.removeClass("active");
				clearInterval(buffInterval);
				albumArt.removeClass("buffering");
				i.attr("class", "fas fa-play");
				audio.pause();
			}
		}, 300);
	}

	function showHover(event) {
		seekBarPos = sArea.offset();
		seekT = event.clientX - seekBarPos.left;
		seekLoc = audio.duration * (seekT / sArea.outerWidth());

		sHover.width(seekT);

		cM = seekLoc / 60;

		ctMinutes = Math.floor(cM);
		ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

		if (ctMinutes < 0 || ctSeconds < 0) return;

		if (ctMinutes < 0 || ctSeconds < 0) return;

		if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
		if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;

		if (isNaN(ctMinutes) || isNaN(ctSeconds)) insTime.text("--:--");
		else insTime.text(ctMinutes + ":" + ctSeconds);

		insTime.css({ left: seekT, "margin-left": "-21px" }).fadeIn(0);
	}

	function hideHover() {
		sHover.width(0);
		insTime
			.text("00:00")
			.css({ left: "0px", "margin-left": "0px" })
			.fadeOut(1);
	}

	function playFromClickedPos() {
		audio.currentTime = seekLoc;
		seekBar.width(seekT);
		hideHover();
	}

	function updateCurrTime() {
		nTime = new Date();
		nTime = nTime.getTime();

		if (!tFlag) {
			tFlag = true;
			trackTime.addClass("active");
		}

		curMinutes = Math.floor(audio.currentTime / 60);
		curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

		durMinutes = Math.floor(audio.duration / 60);
		durSeconds = Math.floor(audio.duration - durMinutes * 60);

		playProgress = (audio.currentTime / audio.duration) * 100;

		if (curMinutes < 10) curMinutes = "0" + curMinutes;
		if (curSeconds < 10) curSeconds = "0" + curSeconds;

		if (durMinutes < 10) durMinutes = "0" + durMinutes;
		if (durSeconds < 10) durSeconds = "0" + durSeconds;

		if (isNaN(curMinutes) || isNaN(curSeconds)) tProgress.text("00:00");
		else tProgress.text(curMinutes + ":" + curSeconds);

		if (isNaN(durMinutes) || isNaN(durSeconds)) tTime.text("00:00");
		else tTime.text(durMinutes + ":" + durSeconds);

		if (
			isNaN(curMinutes) ||
			isNaN(curSeconds) ||
			isNaN(durMinutes) ||
			isNaN(durSeconds)
		)
			trackTime.removeClass("active");
		else trackTime.addClass("active");

		seekBar.width(playProgress + "%");

		if (playProgress == 100) {
			i.attr("class", "fa fa-play");
			seekBar.width(0);
			tProgress.text("00:00");
			albumArt.removeClass("buffering").removeClass("active");
			clearInterval(buffInterval);
		}
	}

	function checkBuffering() {
		clearInterval(buffInterval);
		buffInterval = setInterval(function () {
			if (nTime == 0 || bTime - nTime > 1000)
				albumArt.addClass("buffering");
			else albumArt.removeClass("buffering");

			bTime = new Date();
			bTime = bTime.getTime();
		}, 100);
	}

	function selectTrack(flag) {
		if (flag == 0 || flag == 1) ++currIndex;
		else --currIndex;

		if (currIndex > -1 && currIndex < albumArtworks.length) {
			if (flag == 0) i.attr("class", "fa fa-play");
			else {
				albumArt.removeClass("buffering");
				i.attr("class", "fa fa-pause");
			}

			seekBar.width(0);
			trackTime.removeClass("active");
			tProgress.text("00:00");
			tTime.text("00:00");

			currAlbum = albums[currIndex];
			currTrackName = trackNames[currIndex];
			currArtwork = albumArtworks[currIndex];

			audio.src = trackUrl[currIndex];

			nTime = 0;
			bTime = new Date();
			bTime = bTime.getTime();

			if (flag != 0) {
				audio.play();
				playerTrack.addClass("active");
				albumArt.addClass("active");

				clearInterval(buffInterval);
				checkBuffering();
			}

			albumName.text(currAlbum);
			trackName.text(currTrackName);
			albumArt.find("img.active").removeClass("active");
			$("#" + currArtwork).addClass("active");

		} else {
			if (flag == 0 || flag == 1) --currIndex;
			else ++currIndex;
		}
	}

	function initPlayer() {
		audio = new Audio();

		selectTrack(0);

		audio.loop = false;

		playPauseButton.on("click", playPause);

		sArea.mousemove(function (event) {
			showHover(event);
		});

		sArea.mouseout(hideHover);

		sArea.on("click", playFromClickedPos);

		$(audio).on("timeupdate", updateCurrTime);

		playPreviousTrackButton.on("click", function () {
			selectTrack(-1);
		});
		playNextTrackButton.on("click", function () {
			selectTrack(1);
		});
	}

	initPlayer();
});
