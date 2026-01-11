# 🚀 CHROME DEBUGGING - INSTANT REFERENCE CARD

**Quick Access Guide for Chrome DevTools Debugging**  
**Midnight Gospel 3D Simulator | January 9, 2026**

---

## ⚡ 30-SECOND SETUP

```
1. Open Chrome
2. Go to: http://localhost:5173/
3. Press: F12
4. Start testing!
```

---

## 🎯 5 CHROME DEVTOOLS TABS YOU NEED

### 1️⃣ CONSOLE (Ctrl+Shift+J)
**What it shows**: Messages, errors, warnings, logs

**Look for:**
- ✅ "✅ Simulator initialized" (good)
- ❌ Red text (errors - need attention)
- ⚠️ Yellow text (warnings - usually OK)

**Pro Tip:** Type in console:
```javascript
console.log(navigator.hardwareConcurrency) // CPU cores
console.log(performance.now()) // Current time
```

---

### 2️⃣ NETWORK (Ctrl+Shift+E)
**What it shows**: Every file downloaded, their status, size, load time

**Look for:**
- ✅ All files green/200 status
- ❌ Red 404/500 errors
- ⏱️ Load time should be ~2-3 seconds

**Pro Tip:** Filter by type:
- Click "XHR" to see API calls
- Click "JS" to see JavaScript files
- Click "Img" to see images

---

### 3️⃣ PERFORMANCE (Ctrl+Shift+P)
**What it shows**: FPS, frame timing, CPU usage during scrolling

**Look for:**
- 🟢 FPS at 60 (green) = Perfect
- 🟡 FPS 30-60 (yellow) = OK
- 🔴 FPS <30 (red) = Problem

**How to use:**
1. Click red circle (Record)
2. Scroll through levels
3. Click Stop
4. Analyze the graph

---

### 4️⃣ ELEMENTS (Ctrl+Shift+I)
**What it shows**: HTML structure, CSS, DOM

**Look for:**
- Canvas element: `<canvas></canvas>`
- Check width/height attributes
- Look for error boundaries

**Inspect element:** Right-click any object → Inspect

---

### 5️⃣ SOURCES (Ctrl+Shift+P then "Sources")
**What it shows**: Code, allows breakpoints, step debugging

**Advanced use:**
1. Find file in left panel
2. Click line number to set breakpoint
3. Scroll app - execution pauses
4. Inspect variables on right

---

## 📋 QUICK CHECKLIST

Print this and check while testing:

```
LOAD TEST
□ App loads in 2-3 seconds
□ Console shows "✅ Simulator initialized"
□ No red errors in console

VISUAL TEST
□ Black background visible
□ 3D scene renders
□ Camera movement smooth

LEVEL SCROLL TEST
□ All 6 levels visible
□ Transitions are smooth
□ No stuttering

NETWORK TEST
□ All files show 200 (green)
□ No 404 or 500 errors
□ Total load < 3 seconds

PERFORMANCE TEST
□ Record 10 seconds of scroll
□ FPS stays at 60 (green)
□ No red "long task" bars
□ Memory < 256 MB

FINAL
□ Everything works smoothly
□ Ready for production ✅
```

---

## 🆘 EMERGENCY FIXES

**Blank Screen?**
```
Ctrl+Shift+R (hard refresh)
```

**Low FPS?**
```
Close browser tabs
Restart browser
Check Task Manager for other programs
```

**Assets not loading?**
```
Ctrl+Shift+Delete (clear cache)
npm run dev (restart server)
Ctrl+Shift+R (hard refresh)
```

**WebGL error?**
```
Ctrl+Shift+N (Incognito - no extensions)
Update Chrome
Try Firefox browser
```

---

## 💾 KEYBOARD SHORTCUTS

| Key | Action |
|-----|--------|
| F12 | Open DevTools |
| Ctrl+Shift+J | Console |
| Ctrl+Shift+E | Network |
| Ctrl+Shift+P | Performance |
| Ctrl+Shift+I | Elements |
| Ctrl+Shift+M | Mobile view |
| Ctrl+Shift+R | Hard refresh |
| Ctrl+Shift+Delete | Clear cache |

---

## 📊 WHAT "GOOD" LOOKS LIKE

### Console
```
✅ Simulator initialized
(rest is normal log messages)
(no red errors)
```

### Network
```
index.html               200   1.2 KB
index-xyz.css            200   41 KB
index-abc.js             200   600 KB
three-def.js             200   700 KB
r3f-ghi.js               200   2.8 MB
(all 200 = good!)
```

### Performance
```
[Graph showing line at 60]
↑ 60 FPS (green)
↓ No drops
↑ Smooth curve
```

---

## 🎮 TESTING SCENARIOS

### Scenario 1: Just Checking It Works
Time: 2 minutes
```
1. Load page
2. Check console (no red errors?)
3. Scroll down slowly
4. Check FPS (60?)
5. Done!
```

### Scenario 2: Detailed Testing
Time: 10 minutes
```
1. Open Console, check messages
2. Open Network, reload, check files
3. Open Performance, record scroll
4. Analyze FPS graph
5. Check all 6 levels load
6. Done!
```

### Scenario 3: Hunting Specific Issues
Time: 15 minutes
```
1. Reproduce the issue
2. Open Console, copy error
3. Check Network for failed files
4. Check Performance for FPS drops
5. Use Sources to set breakpoints
6. Step through code
7. Identify root cause
```

---

## ✅ WHAT TO REPORT IF YOU FIND BUGS

**Good bug report:**
```
Title: Low FPS on Level 2

Description:
When scrolling to Level 2 (Clown Planet), 
the frame rate drops to 30 FPS.

Steps to Reproduce:
1. Open http://localhost:5173/
2. Scroll down to 35% (Level 2)
3. Record performance (Ctrl+Shift+P)
4. Observe FPS at 30 instead of 60

Browser: Chrome 120
System: Windows 11
```

---

## 🔗 USEFUL LINKS

Documentation in the project:
- CHROME_DEBUGGING_GUIDE.md (full reference)
- CHROME_DEBUGGING_SETUP.md (setup guide)
- LAUNCH_REFERENCE.md (deployment guide)
- PROJECT_COMPLETE_SUMMARY_JAN_9.md (project info)

---

## 🎊 YOU'RE READY!

```
http://localhost:5173/   ← Type this in Chrome
F12                      ← Press this
Start testing!           ← Do this
```

Enjoy! 🔍

---

**Quick Reference Card**  
Midnight Gospel 3D | January 9, 2026  
Dev Server Status: ✅ RUNNING
