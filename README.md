# RADIATRON X-9 DRS - ENHANCED RECEIVER DASHBOARD

## 🟢 Enhanced Sci-Fi Neon Display System with Brainwave Monitoring

This is the enhanced version of the RADIATRON X-9 DRS receiver dashboard, featuring an advanced loading animation and real-time brainwave visualization.

## 🚀 New Features in Version 2.2

### 1. **Neon Circular Loading Screen**
- Animated circular progress indicator (0-100%)
- Glowing neon green effect with pulsating dots
- Smooth transition from intro sequence to main display
- **COMPLETES TO 100%** before transitioning to messages
- Professional loading animation between R-SCOPE and message playback

### 2. **Real-Time Brainwave Graphs**
Five different brainwave patterns displayed in corners:
- **Gamma (40Hz)** - Top Left: Problem solving, concentration
- **Beta (20Hz)** - Top Right: Busy, active mind
- **Alpha (10Hz)** - Bottom Left: Reflective, restful
- **Theta (6Hz)** - Bottom Right: Drowsiness
- **Delta (2Hz)** - Middle Left: Sleep, dreaming

Each graph features:
- Live animated waveforms
- Frequency-accurate wave patterns
- Glowing neon green visualization
- Semi-transparent overlays
- Grid background for scientific appearance

### 3. **Simplified Message Display**
- **CLEAN MESSAGE VIEW** - Only the message text is displayed
- **NO TRANSMISSION COUNTER** - Removed "TRANSMISSION X/Y" header
- **NO TIMESTAMP** - Removed time display for cleaner look
- **PERSISTENT LAST MESSAGE** - Final message stays on screen
- **LARGER TEXT** - Increased font size for better visibility

### 4. **Enhanced Visual Effects**
- Improved scanline animation
- Better grid overlay pattern
- Enhanced glow effects on all text
- Smooth fade transitions

## 📊 Sequence Flow

1. **Initial Boot (0-10s)**
   - Display: "RADIATRON X-9 DRS"
   - Full neon glow effect

2. **System Identification (10-13s)**
   - Display: "R-SCOPE" (top line)
   - Display: "X-9" (bottom line)
   - Stacked layout with transition effect

3. **Loading Phase (13-19s)**
   - Circular loading animation
   - **6-second total duration**
   - Progress from 0% to 100%
   - **Completes fully to 100%**
   - Animated dots around circle
   - "Loading..." text with glow

4. **Message Playback (19s+)**
   - Brainwave graphs activate in corners
   - Messages display with 10-second intervals
   - **Only message text shown** (no counter/timestamp)
   - Full visualization suite active

5. **Final State**
   - **Last message remains on screen**
   - Brainwave graphs continue running
   - No standby mode - persistent display

## 🛠 Installation & Setup

### Quick Start:
```bash
# Install dependencies
npm install

# Start development server
npm start
```

### Production Build:
```bash
npm run build
```

## 🖥 Raspberry Pi Deployment

### For Optimal Display:
1. Build the application:
```bash
npm run build
```

2. Copy to web server:
```bash
sudo cp -r build/* /var/www/html/
```

3. Configure for 7-inch display with brainwave visualization:
```bash
# Edit boot config
sudo nano /boot/config.txt

# Recommended settings for graph clarity:
hdmi_cvt=1280 720 60 3 0 0 0
hdmi_group=2
hdmi_mode=87
```

4. Auto-start in kiosk mode:
```bash
# Edit autostart
nano ~/.config/lxsession/LXDE-pi/autostart

# Add:
@chromium-browser --kiosk --incognito http://localhost
@unclutter -idle 0
```

## 🎨 Technical Specifications

### Brainwave Graph Implementation:
- **Canvas-based rendering** for smooth 60fps animation
- **Mathematical sine wave generation** with accurate frequencies
- **Real-time animation** using requestAnimationFrame
- **Responsive positioning** in screen corners
- **Glow effects** using canvas shadowBlur

### Loading Animation:
- **SVG-based circular progress**
- **20 animated dots** around circumference
- **Smooth percentage counter** from 0-100%
- **Gradient background** with radial glow

### Performance Optimizations:
- Efficient canvas rendering
- Minimal DOM updates
- Hardware-accelerated CSS animations
- Optimized for Raspberry Pi GPU

## 📱 Display Configurations

### Standard Monitor (1920x1080):
- Graphs: 200x100px in corners
- Loading circle: 250px diameter
- Message text: 48px

### 7-inch Display (1280x720):
- Graphs scale proportionally
- All elements responsive
- Maintains readability

### Mobile/Tablet:
- Responsive layout
- Touch-friendly (if needed)
- Auto-scaling graphs

## 🔧 Customization

### Adjust Brainwave Parameters:
Edit the `waveConfigs` object in App.js:
```javascript
gamma: { frequency: 40, amplitude: 15, speed: 3, color: 'rgba(0, 255, 0, 0.8)' }
```

### Change Loading Duration:
Modify the loading animation speed:
```javascript
for (let i = 0; i <= 100; i += 2) {  // Change increment
  setLoadingProgress(i);
  await new Promise(resolve => setTimeout(resolve, 50)); // Change delay
}
```

### Graph Positions:
Customize graph placement in `positionStyles`:
```javascript
topLeft: { top: '20px', left: '20px' }
```

## 🎯 Use Cases

1. **Scientific Displays**: Laboratory monitoring systems
2. **Art Installations**: Interactive sci-fi exhibitions
3. **Escape Rooms**: Atmospheric prop displays
4. **Gaming Setup**: Ambient room display
5. **Halloween/Events**: Themed decorations

## 🐛 Troubleshooting

### Graphs Not Animating:
- Check browser supports Canvas API
- Ensure requestAnimationFrame is available
- Verify no console errors

### Loading Screen Stuck:
- Check Firebase connection
- Verify async sequence completion
- Review console for errors

### Performance Issues on Pi:
- Reduce graph update frequency
- Lower animation complexity
- Use hardware acceleration flags

## 📝 Firebase Data Structure
```json
{
  "radiatron": {
    "messages": {
      "messageId": {
        "text": "YOUR MESSAGE HERE",
        "timestamp": 1234567890
      }
    }
  }
}
```

## 🚦 Version History

### v2.2.0 (Current)
- R-SCOPE and X-9 now on separate lines
- Extended loading screen to 6 seconds
- Smoother loading animation timing
- Improved text layout and spacing

### v2.1.0
- Removed transmission counter and timestamp
- Loading completes to 100% before transitioning
- Last message persists on screen (no standby)
- Increased message font size
- Cleaner, more focused display

### v2.0.0
- Added circular loading animation
- Integrated 5 brainwave graphs
- Enhanced visual effects
- Improved sequence flow

### v1.0.0
- Initial release
- Basic message display
- Simple intro sequence

## 📄 License
MIT License - Free to use and modify

## 🤝 Contributing
Feel free to submit issues and enhancement requests!

---

**RADIATRON X-9 DRS** - *Where Science Meets Fiction*
