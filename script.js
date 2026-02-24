        let mode = 'human';
        let difficulty = 'easy';
        let secretNumber = "";
        let gameOver = false;
        let attempts = 0;
        let startTime = null;
        let timerInterval = null;
        let hintsLeft = 3;
        let soundEnabled = true;
        
        // AI Mode
        let aiPossibilities = [];
        let aiCurrentGuess = "";

        // Statistics
        let stats = {
            gamesPlayed: 0,
            wins: 0,
            totalAttempts: 0,
            bestTime: null,
            leaderboard: []
        };

        // History
        let guessHistory = [];
        let historyIndex = -1;

        // DOM Elements
        const elLog = document.getElementById('game-log');
        const elStatus = document.getElementById('status-msg');
        const elInputHuman = document.getElementById('human-guess');
        const elInputAreaHuman = document.getElementById('input-area-human');
        const elInputAreaAI = document.getElementById('input-area-ai');
        const elAiCurrentGuess = document.getElementById('ai-current-guess');
        const elTimer = document.getElementById('timer');
        const elAttempts = document.getElementById('attempts');
        const elHintsLeft = document.getElementById('hints-left');
        const elHintBtn = document.getElementById('hint-btn');
        const elHintDisplay = document.getElementById('hint-display');

        // ===== INITIALIZATION =====
        window.onload = () => {
            loadStats();
            initAmbientCanvas();
            initGame();
            updateStatsDisplay();
        };

        // ===== AMBIENT CANVAS BACKGROUND =====
        function initAmbientCanvas() {
            const canvas = document.getElementById('ambient-canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size
            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            // Particle system
            const particles = [];
            const particleCount = 150;
            const colors = [
                'rgba(112, 214, 255, 0.6)',  // sky-blue
                'rgba(123, 211, 137, 0.6)',  // grass-green
                'rgba(255, 217, 61, 0.6)',   // sun-yellow
                'rgba(255, 133, 161, 0.6)',  // cow-pink
                'rgba(157, 78, 221, 0.6)',   // arcade-purple
            ];

            class Particle {
                constructor() {
                    this.reset();
                    this.y = Math.random() * canvas.height;
                    this.opacity = Math.random() * 0.5 + 0.2;
                }

                reset() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 3 + 1;
                    this.speedX = Math.random() * 0.5 - 0.25;
                    this.speedY = Math.random() * 0.5 - 0.25;
                    this.color = colors[Math.floor(Math.random() * colors.length)];
                    this.life = Math.random() * 200 + 100;
                    this.age = 0;
                }

                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    this.age++;

                    // Wrap around edges
                    if (this.x < 0) this.x = canvas.width;
                    if (this.x > canvas.width) this.x = 0;
                    if (this.y < 0) this.y = canvas.height;
                    if (this.y > canvas.height) this.y = 0;

                    // Reset if too old
                    if (this.age > this.life) {
                        this.reset();
                    }
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                }
            }

            // Create particles
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }

            // Animation loop
            function animate() {
                // Create trailing effect
                ctx.fillStyle = 'rgba(10, 10, 26, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw connections
                ctx.strokeStyle = 'rgba(112, 214, 255, 0.1)';
                ctx.lineWidth = 1;
                
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 150) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.globalAlpha = 1 - distance / 150;
                            ctx.stroke();
                            ctx.globalAlpha = 1;
                        }
                    }
                }

                // Update and draw particles
                particles.forEach(particle => {
                    particle.update();
                    particle.draw();
                });

                requestAnimationFrame(animate);
            }

            animate();
        }

        function initGame() {
            gameOver = false;
            attempts = 0;
            hintsLeft = getDifficultySettings().hints;
            guessHistory = [];
            historyIndex = -1;
            
            elLog.innerHTML = "";
            elInputHuman.value = "";
            elAttempts.innerText = attempts;
            elHintsLeft.innerText = hintsLeft;
            elHintDisplay.classList.add('hidden');
            elHintBtn.disabled = false;
            
            stopTimer();
            
            if (mode === 'human') {
                secretNumber = generateSecretNumber();
                console.log("🔐 Secret:", secretNumber);
                log("🎮 NEW GAME STARTED!", "#7bd389");
                setStatus("🎯 Crack the 4-digit code! Good luck!", "#70d6ff");
                startTimer();
                // Focus on input field
                setTimeout(() => elInputHuman.focus(), 100);
            } else {
                aiPossibilities = generateAllPermutations();
                aiCurrentGuess = aiPossibilities[Math.floor(Math.random() * aiPossibilities.length)];
                log("🤖 AI IS READY TO GUESS!", "#9d4edd");
                setStatus("🧠 AI has made its first guess!", "#ff85a1");
                elAiCurrentGuess.innerText = aiCurrentGuess;
                startTimer();
            }

            playSound('start');
        }

        function setMode(selectedMode) {
            mode = selectedMode;
            document.getElementById('btn-mode-human').classList.toggle('active', mode === 'human');
            document.getElementById('btn-mode-ai').classList.toggle('active', mode === 'ai');

            if (mode === 'human') {
                elInputAreaHuman.classList.remove('hidden');
                elInputAreaAI.classList.add('hidden');
            } else {
                elInputAreaHuman.classList.add('hidden');
                elInputAreaAI.classList.remove('hidden');
            }
            initGame();
        }

        function setDifficulty(level) {
            difficulty = level;
            document.querySelectorAll('.diff-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            initGame();
        }

        function getDifficultySettings() {
            const settings = {
                easy: { hints: 5 },
                medium: { hints: 3 },
                hard: { hints: 1 }
            };
            return settings[difficulty];
        }

        // ===== TIMER =====
        function startTimer() {
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 100);
        }

        function stopTimer() {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
        }

        function updateTimer() {
            if (!startTime) return;
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            elTimer.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        function getElapsedTime() {
            if (!startTime) return 0;
            return Math.floor((Date.now() - startTime) / 1000);
        }

        // ===== GAME LOGIC =====
        function generateSecretNumber() {
            let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            for (let i = nums.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [nums[i], nums[j]] = [nums[j], nums[i]];
            }
            return nums.slice(0, 4).join('');
        }

        function calculateBullsAndCows(secret, guess) {
            let bulls = 0, cows = 0;
            for (let i = 0; i < 4; i++) {
                if (guess[i] === secret[i]) {
                    bulls++;
                } else if (secret.includes(guess[i])) {
                    cows++;
                }
            }
            return { bulls, cows };
        }

        function submitHumanGuess() {
            if (gameOver) return;

            const guess = elInputHuman.value;

            if (guess.length !== 4) {
                setStatus("⚠️ Please enter exactly 4 digits!", "#ff595e");
                playSound('error');
                return;
            }
            if (!/^\d+$/.test(guess)) {
                setStatus("⚠️ Numbers only please!", "#ff595e");
                playSound('error');
                return;
            }
            if (hasRepeatingDigits(guess)) {
                setStatus("⚠️ All digits must be unique!", "#ff595e");
                playSound('error');
                return;
            }

            attempts++;
            elAttempts.innerText = attempts;
            guessHistory.push(guess);
            historyIndex = guessHistory.length;

            const result = calculateBullsAndCows(secretNumber, guess);
            
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.innerHTML = `
                <span class="guess-number">${guess}</span>
                <span class="result-badge">
                    <span class="bulls">🎯 ${result.bulls}</span>
                    <span class="cows">🐮 ${result.cows}</span>
                </span>
            `;
            elLog.appendChild(entry);
            elLog.scrollTop = elLog.scrollHeight;

            elInputHuman.value = "";
            playSound('guess');

            if (result.bulls === 4) {
                gameWin();
            } else {
                const encouragement = getEncouragement(result);
                setStatus(encouragement, "#70d6ff");
            }
        }

        function getEncouragement(result) {
            if (result.bulls + result.cows === 0) return "❌ No matches! Try completely different digits";
            if (result.bulls === 3) return "🔥 WOW! Just ONE more digit in the right position!";
            if (result.bulls === 2) return "💪 Great! Two in correct positions!";
            if (result.bulls + result.cows >= 3) return "👍 You're getting really close!";
            return "🎯 Keep trying! You can do it!";
        }

        function hasRepeatingDigits(str) {
            return new Set(str).size !== str.length;
        }

        function gameWin() {
            gameOver = true;
            const time = getElapsedTime();
            stopTimer();
            
            setStatus("🎉 CONGRATULATIONS! You cracked the code!", "#7bd389");
            log(`✨ VICTORY! Code: ${secretNumber} | ${attempts} attempts | ${formatTime(time)}`, "#ffd93d");
            
            stats.gamesPlayed++;
            stats.wins++;
            stats.totalAttempts += attempts;
            
            if (!stats.bestTime || time < stats.bestTime) {
                stats.bestTime = time;
            }

            stats.leaderboard.push({
                attempts,
                time,
                difficulty,
                date: new Date().toLocaleDateString()
            });
            stats.leaderboard.sort((a, b) => a.attempts - b.attempts || a.time - b.time);
            stats.leaderboard = stats.leaderboard.slice(0, 5);

            saveStats();
            updateStatsDisplay();
            showVictory(attempts, time);
            playSound('win');
            createConfetti();
        }

        function createConfetti() {
            const colors = ['#70d6ff', '#7bd389', '#ffd93d', '#ff85a1', '#ff595e', '#9d4edd'];
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + '%';
                    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.animationDelay = Math.random() * 0.5 + 's';
                    document.body.appendChild(confetti);
                    setTimeout(() => confetti.remove(), 3000);
                }, i * 30);
            }
        }

        function showVictory(attempts, time) {
            document.getElementById('victory-attempts').innerText = attempts;
            document.getElementById('victory-time').innerText = formatTime(time);
            document.getElementById('victory-difficulty').innerText = difficulty.toUpperCase();
            document.getElementById('victory-overlay').style.display = 'flex';
        }

        function closeVictory() {
            document.getElementById('victory-overlay').style.display = 'none';
            initGame();
        }

        // ===== AI MODE =====
        function generateAllPermutations() {
            const results = [];
            for (let i = 0; i < 10000; i++) {
                let s = i.toString().padStart(4, '0');
                if (new Set(s).size === 4) results.push(s);
            }
            return results;
        }

        function submitAIFeedback() {
            if (gameOver) return;

            const bulls = parseInt(document.getElementById('ai-bulls').value);
            const cows = parseInt(document.getElementById('ai-cows').value);

            if (isNaN(bulls) || isNaN(cows) || bulls < 0 || cows < 0 || bulls + cows > 4) {
                setStatus("⚠️ Invalid feedback! Check your values", "#ff595e");
                playSound('error');
                return;
            }

            attempts++;
            elAttempts.innerText = attempts;

            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.innerHTML = `
                <span style="color: #9d4edd; font-weight: 600;">🤖 AI:</span>
                <span class="guess-number">${aiCurrentGuess}</span>
                <span class="result-badge">
                    <span class="bulls">🎯 ${bulls}</span>
                    <span class="cows">🐮 ${cows}</span>
                </span>
            `;
            elLog.appendChild(entry);

            aiPossibilities = aiPossibilities.filter(candidate => {
                const result = calculateBullsAndCows(candidate, aiCurrentGuess);
                return result.bulls === bulls && result.cows === cows;
            });

            if (bulls === 4) {
                gameOver = true;
                const time = getElapsedTime();
                stopTimer();
                setStatus("🤖 AI WINS! The code was cracked!", "#ff595e");
                log(`🏆 AI VICTORY! Code: ${aiCurrentGuess} in ${attempts} attempts!`, "#ff85a1");
                playSound('lose');
                stats.gamesPlayed++;
                saveStats();
                updateStatsDisplay();
                return;
            }

            if (aiPossibilities.length === 0) {
                gameOver = true;
                setStatus("❌ Contradiction detected! Please check your feedback", "#ff595e");
                log("💥 No valid solutions remain!", "#ff595e");
                playSound('error');
                return;
            }

            aiCurrentGuess = aiPossibilities[Math.floor(Math.random() * aiPossibilities.length)];
            elAiCurrentGuess.innerText = aiCurrentGuess;
            elLog.scrollTop = elLog.scrollHeight;
            
            setStatus(`🧠 AI is thinking... ${aiPossibilities.length} possibilities left`, "#70d6ff");
            playSound('guess');
            
            document.getElementById('ai-bulls').value = 0;
            document.getElementById('ai-cows').value = 0;
        }

        // ===== HINT SYSTEM =====
        function getHint() {
            if (hintsLeft <= 0 || gameOver) return;
            
            hintsLeft--;
            elHintsLeft.innerText = hintsLeft;
            
            const hintType = Math.random();
            let hintText = "";
            
            if (hintType < 0.4) {
                const randomPos = Math.floor(Math.random() * 4);
                hintText = `💡 Position ${randomPos + 1} has the digit: ${secretNumber[randomPos]}`;
            } else if (hintType < 0.7) {
                const digit = secretNumber[Math.floor(Math.random() * 4)];
                hintText = `💡 The digit ${digit} is somewhere in the code`;
            } else {
                const digits = secretNumber.split('').map(Number);
                const hasLow = digits.some(d => d <= 4);
                const hasHigh = digits.some(d => d >= 5);
                if (hasLow && hasHigh) {
                    hintText = `💡 Mix of low (0-4) and high (5-9) digits`;
                } else if (hasLow) {
                    hintText = `💡 All digits are between 0-4`;
                } else {
                    hintText = `💡 All digits are between 5-9`;
                }
            }
            
            elHintDisplay.innerText = hintText;
            elHintDisplay.classList.remove('hidden');
            playSound('hint');
            
            if (hintsLeft === 0) {
                elHintBtn.disabled = true;
            }
        }

        // ===== STATISTICS =====
        function loadStats() {
            const saved = localStorage.getItem('bulls_cows_colorful_stats');
            if (saved) {
                stats = JSON.parse(saved);
            }
        }

        function saveStats() {
            localStorage.setItem('bulls_cows_colorful_stats', JSON.stringify(stats));
        }

        function updateStatsDisplay() {
            document.getElementById('games-played').innerText = stats.gamesPlayed;
            document.getElementById('total-wins').innerText = stats.wins;
            
            const winRate = stats.gamesPlayed > 0 
                ? Math.round((stats.wins / stats.gamesPlayed) * 100) 
                : 0;
            document.getElementById('win-rate').innerText = winRate + '%';
            
            const avgAttempts = stats.wins > 0 
                ? Math.round(stats.totalAttempts / stats.wins) 
                : 0;
            document.getElementById('avg-attempts').innerText = avgAttempts;
            
            document.getElementById('best-time').innerText = stats.bestTime 
                ? formatTime(stats.bestTime) 
                : '--';

            updateLeaderboard();
        }

        function updateLeaderboard() {
            const leaderboard = document.getElementById('leaderboard');
            
            if (stats.leaderboard.length === 0) {
                leaderboard.innerHTML = `
                    <div style="text-align: center; color: rgba(255,255,255,0.3); padding: 40px 20px; font-size: 0.9rem;">
                        🎯 No records yet!<br>Start playing to see your best runs here
                    </div>`;
                return;
            }

            leaderboard.innerHTML = stats.leaderboard.map((entry, index) => `
                <div class="leaderboard-entry">
                    <div class="rank rank-${index < 3 ? index + 1 : 'other'}">
                        ${index + 1}
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 700; color: white; margin-bottom: 5px;">
                            ${entry.attempts} attempts • ${formatTime(entry.time)}
                        </div>
                        <div style="color: rgba(255,255,255,0.5); font-size: 0.75rem;">
                            ${entry.difficulty.toUpperCase()} • ${entry.date}
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${String(secs).padStart(2, '0')}`;
        }

        // ===== SOUND =====
        function playSound(type) {
            if (!soundEnabled) return;
            
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                const sounds = {
                    start: [523.25, 0.1],
                    guess: [659.25, 0.08],
                    win: [783.99, 0.3],
                    lose: [293.66, 0.3],
                    error: [220.00, 0.15],
                    hint: [880.00, 0.12]
                };
                
                const [freq, duration] = sounds[type] || [440, 0.1];
                
                oscillator.frequency.value = freq;
                gainNode.gain.value = 0.15;
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + duration);
            } catch (e) {
                console.log('Sound not supported');
            }
        }

        function toggleSound() {
            soundEnabled = !soundEnabled;
            document.getElementById('sound-icon').innerText = soundEnabled ? '🔊' : '🔇';
            document.getElementById('sound-status').innerText = soundEnabled ? 'ON' : 'OFF';
            playSound('start');
        }

        // ===== UTILITIES =====
        function log(msg, color) {
            const div = document.createElement('div');
            div.style.color = color;
            div.style.textAlign = "center";
            div.style.padding = "15px 0";
            div.style.borderBottom = "1px dashed rgba(255,255,255,0.1)";
            div.style.fontWeight = "700";
            div.style.fontSize = "0.95rem";
            div.innerText = msg;
            elLog.appendChild(div);
            elLog.scrollTop = elLog.scrollHeight;
        }

        function setStatus(msg, color) {
            elStatus.innerText = msg;
            elStatus.style.borderColor = color;
            elStatus.style.background = `linear-gradient(135deg, ${color}20, ${color}10)`;
            elStatus.style.animation = 'none';
            setTimeout(() => elStatus.style.animation = '', 10);
        }

        // ===== EVENT LISTENERS =====
        elInputHuman.addEventListener("keypress", (e) => {
            if (e.key === "Enter") submitHumanGuess();
        });

        elInputHuman.addEventListener("keydown", (e) => {
            if (e.key === "ArrowUp") {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    elInputHuman.value = guessHistory[historyIndex];
                }
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                if (historyIndex < guessHistory.length - 1) {
                    historyIndex++;
                    elInputHuman.value = guessHistory[historyIndex];
                } else {
                    historyIndex = guessHistory.length;
                    elInputHuman.value = "";
                }
            }
        });

        document.getElementById('victory-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'victory-overlay') closeVictory();
        });
