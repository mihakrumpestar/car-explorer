const global_volume = document.getElementById("global_volume");
const background_music_volume = document.getElementById("background_music_volume");
const in_game_music_volume = document.getElementById("in_game_music_volume");


class globalStoreSound {

    constructor() {
        this.global_volume = 0.5;
        this.background_music_volume = 0.5;
        this.in_game_music_volume = 0.5;

        this.background_music = new Howl({
            src: '/assets/audio/background.mp3',
            autoplay: true,
            loop: true,
            volume: this.background_music_volume,
            onend: function() {
                console.log('Finished!');
            }
        });

        global_volume.value = this.global_volume;
        background_music_volume.value = this.background_music_volume;
        in_game_music_volume.value = this.in_game_music_volume;

        global_volume.addEventListener("input", this.setGlobalVolume);
        global_volume.addEventListener("change", this.setGlobalVolume);

        background_music_volume.addEventListener("input", this.setBackgroundMusicVolume);
        background_music_volume.addEventListener("change", this.setBackgroundMusicVolume);

    }


    setGlobalVolume = (e) => {
        let volume = e.target.value;
        console.log("Volume", volume);
        this.global_volume = volume;
        Howler.volume(volume);
    }

    setBackgroundMusicVolume = (e) => {
        let volume = e.target.value;
        this.background_music_volume = volume;
        this.background_music.volume(volume);
    }




}

export { globalStoreSound };


  
