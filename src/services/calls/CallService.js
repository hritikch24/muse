class CallService {
  constructor() {
    this.isInCall = false;
    this.callType = null;
    this.roomUrl = null;
    this.localStream = null;
    this.isVideoEnabled = true;
    this.isAudioEnabled = true;
    this.listeners = {};
  }

  async createRoom(matchId, callType = 'video') {
    const roomName = `muse-${matchId}-${Date.now()}`;
    this.roomUrl = roomName;
    this.callType = callType;
    return roomName;
  }

  async joinRoom(roomUrl, userName, isVideoEnabled = true) {
    this.roomUrl = roomUrl;
    this.isInCall = true;
    this.isVideoEnabled = isVideoEnabled;
    
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: true
      });
    } catch (error) {
      console.warn('Could not get media devices:', error);
      this.localStream = null;
    }
    
    this.emit('joined', { roomUrl, userName });
    return this.localStream;
  }

  async toggleVideo() {
    this.isVideoEnabled = !this.isVideoEnabled;
    
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = this.isVideoEnabled;
      });
    }
    
    this.emit('videoToggled', this.isVideoEnabled);
    return this.isVideoEnabled;
  }

  async toggleAudio() {
    this.isAudioEnabled = !this.isAudioEnabled;
    
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = this.isAudioEnabled;
      });
    }
    
    this.emit('audioToggled', this.isAudioEnabled);
    return this.isAudioEnabled;
  }

  async switchCamera() {
    if (!this.localStream) return;
    
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      
      if (videoDevices.length > 1) {
        const currentTrack = this.localStream.getVideoTracks()[0];
        const currentDeviceId = currentTrack?.getSettings()?.deviceId;
        const nextDevice = videoDevices.find(d => d.deviceId !== currentDeviceId);
        
        if (nextDevice) {
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: nextDevice.deviceId }
          });
          
          const newTrack = newStream.getVideoTracks()[0];
          currentTrack?.stop();
          
          this.localStream.removeTrack(currentTrack);
          this.localStream.addTrack(newTrack);
          
          this.emit('cameraSwitched', nextDevice.label);
        }
      }
    } catch (error) {
      console.warn('Could not switch camera:', error);
    }
  }

  async endCall() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    this.isInCall = false;
    this.callType = null;
    this.roomUrl = null;
    this.isVideoEnabled = true;
    this.isAudioEnabled = true;
    
    this.emit('ended', {});
  }

  getLocalStream() {
    return this.localStream;
  }

  getParticipants() {
    return {
      local: {
        session_id: 'local',
        audio: this.isAudioEnabled,
        video: this.isVideoEnabled
      }
    };
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

export default new CallService();
