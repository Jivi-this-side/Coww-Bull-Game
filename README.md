# 🐮 Bulls & Cows 🎯

Nothing  just a Beginner friendly number guessing Game with AI twist !

## 🎮 Game Overview

Bulls & Cows is a classic code-breaking puzzle game where players try to guess a secret 4-digit code. Each guess receives feedback in the form of "Bulls" and "Cows":

- 🎯 **Bulls**: Correct digit in the correct position
- 🐮 **Cows**: Correct digit but in the wrong position

The goal is to crack the code in as few attempts as possible!

## ✨ Features

### 🎯 Game Modes
1. **Player vs CPU**: Crack the computer-generated code
2. **AI vs Player**: Watch the AI try to guess your secret code

### 🏆 Difficulty Levels
- 😊 **Easy**: 5 hints available
- 🎯 **Medium**: 3 hints available  
- 🔥 **Hard**: 1 hint available

### 📊 Statistics & Tracking
- **Session Stats**: Games played, wins, win rate, average attempts
- **Leaderboard**: Top 5 best runs with medal rankings (🥇🥈🥉)
- **Best Time Tracking**: Record your fastest solve times
- **Persistent Storage**: Stats saved in browser localStorage

### 💡 Hint System
Get strategic clues to help crack the code:
- Position-specific digit reveals
- Digit presence confirmation
- Range hints (low/high digits)

### 🎵 Sound Effects
- Interactive audio feedback for actions
- Toggle sound on/off
- Custom frequencies for different events

### ⌨️ Keyboard Controls
- **Enter**: Submit guess
- **↑ Arrow**: Navigate guess history (previous)
- **↓ Arrow**: Navigate guess history (next)



## 🎮 How to Play

### Player vs CPU Mode

1. **Select Difficulty**: Choose Easy, Medium, or Hard
2. **Enter Your Guess**: Type 4 unique digits (0-9) in the input field
3. **Submit**: Press Enter or click Submit button
4. **Analyze Feedback**: 
   - 🎯 Bulls = Right digit, right position
   - 🐮 Cows = Right digit, wrong position
5. **Use Hints**: Click "Get Hint" if you need help
6. **Win**: Get 4 Bulls to crack the code!

### AI vs Player Mode

1. **Think of a Secret Code**: 4 unique digits (0-9)
2. **AI Makes a Guess**: AI suggests a code
3. **Provide Feedback**: Enter Bulls and Cows for AI's guess
4. **Watch AI Think**: AI narrows down possibilities
5. **See if AI Wins**: Can you stump the AI?


## 📱 Responsive Design

Fully responsive and mobile-friendly:
- **Desktop**: Full feature experience (1024px+)
- **Tablet**: Optimized layout (768px - 1023px)
- **Mobile**: Touch-optimized controls (320px - 767px)

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Advanced animations, gradients, glass morphism
- **Vanilla JavaScript**: No frameworks or libraries
- **Canvas API**: Ambient particle background
- **Web Audio API**: Sound effects
- **LocalStorage API**: Statistics persistence
  

## 🎯 Game Rules

1. **Code Composition**:
   - Exactly 4 digits (0-9)
   - All digits must be unique
   - Examples: `1234`, `5678`, `0927`

2. **Feedback System**:
   - Bulls = Correct digit AND correct position
   - Cows = Correct digit BUT wrong position
   - No feedback = Digit not in code

3. **Winning Condition**:
   - Achieve 4 Bulls (all digits correct and in right positions)

4. **Example**:
   ```
   Secret Code: 1234
   Your Guess:  1357
   Result:      1 Bull (1 is correct), 1 Cow (3 is in code but wrong position)
   ```

## 📊 Statistics Explained

### Session Stats
- **Games Played**: Total number of games started
- **Wins**: Successfully cracked codes
- **Win Rate**: Percentage of games won
- **Avg. Attempts**: Average number of guesses per win
- **Best Time**: Fastest time to crack a code

### Leaderboard
- Top 5 best runs ranked by:
  1. Fewest attempts (primary)
  2. Fastest time (tiebreaker)
- Medal rankings: 🥇 Gold, 🥈 Silver, 🥉 Bronze

## 🎨 Customization

### Changing Colors
Edit the CSS variables in the `:root` section:
```css
:root {
    --sky-blue: #70d6ff;
    --grass-green: #7bd389;
    --sun-yellow: #ffd93d;
    /* etc. */
}
```

### Adjusting Difficulty
Modify hint counts in the JavaScript:
```javascript
const settings = {
    easy: { hints: 5 },
    medium: { hints: 3 },
    hard: { hints: 1 }
};
```

### Particle Count
Change background particle density:
```javascript
const particleCount = 150; // Increase or decrease
```


## 🎮 Tips for Success

1. **Start Systematic**: Try `0123` as first guess to test 4 digits
2. **Use Hints Wisely**: Save hints for when you're stuck
3. **Track Patterns**: Note which digits appear as cows
4. **Eliminate Options**: Use process of elimination
5. **Remember Position**: Bulls tell you what NOT to move

---

### Main Game Interface
- Colorful gradient UI with ambient background
- Real-time stats tracking
- Animated feedback system

### Victory Screen
- Confetti celebration
- Detailed game statistics
- Quick restart option

### AI Mode
- Watch AI solve your code
- See possibility space shrink
- Test your feedback accuracy

---

**Enjoy the game! 🎉 May the odds be ever in your favor! 🐮🎯🐂**

---
