// AlphaPulse Chat Component
// Shared across all pages

// Chat state
let chatOpen = false;
let currentChannel = '#general';

// Initialize chat on page load
document.addEventListener('DOMContentLoaded', function() {
    addChatComponents();
    initializeChat();
});

function addChatComponents() {
    // Create chat toggle button
    const chatToggle = document.createElement('button');
    chatToggle.className = 'chat-toggle';
    chatToggle.onclick = toggleChat;
    chatToggle.innerHTML = `
        💬
        <span class="chat-badge">2</span>
    `;
    
    // Create chat panel
    const chatPanel = document.createElement('div');
    chatPanel.className = 'chat-panel';
    chatPanel.id = 'chatPanel';
    chatPanel.innerHTML = `
        <div class="chat-header">
            <span>#general</span>
            <button class="chat-close" onclick="toggleChat()">×</button>
        </div>
        
        <div class="chat-tabs">
            <div class="chat-tab active" onclick="switchChatTab('#general')">#general</div>
            <div class="chat-tab" onclick="switchChatTab('#market')">#market</div>
            <div class="chat-tab" onclick="switchChatTab('#strategies')">#strategies</div>
            <div class="chat-tab" onclick="switchChatTab('#help')">#help</div>
        </div>
        
        <div class="chat-messages" id="chatMessages">
            <!-- Messages will be populated by JavaScript -->
        </div>
        
        <div class="chat-input-area">
            <input type="text" class="chat-input" placeholder="Type a message..." onkeypress="handleChatInput(event)">
        </div>
        
        <div class="chat-users">
            <div class="chat-users-title">Online (8)</div>
            <span class="chat-user online">quantdev</span>
            <span class="chat-user online">algoquant</span>
            <span class="chat-user online">mltrader</span>
            <span class="chat-user">riskmanager</span>
            <span class="chat-user online">newbie_quant</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(chatToggle);
    document.body.appendChild(chatPanel);
}

function initializeChat() {
    // Set initial messages based on current page
    const currentPage = getCurrentPage();
    loadInitialMessages(currentPage);
    
    // Start message simulation
    setInterval(simulateMessages, 20000);
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('strategy-lab')) return 'lab';
    if (path.includes('markets')) return 'markets';
    if (path.includes('screener')) return 'screener';
    return 'forum';
}

function loadInitialMessages(page) {
    const messagesContainer = document.getElementById('chatMessages');
    let messages = [];
    
    switch(page) {
        case 'forum':
            messages = [
                { time: '14:45', user: 'quantdev', text: 'Great discussion on that backtesting bias post' },
                { time: '14:46', user: 'algoquant', text: 'Yeah, the data snooping section was spot on' },
                { time: '14:47', user: 'system', text: 'New post: "Multi-Armed Bandits for Portfolio Allocation" gaining traction' },
                { time: '14:48', user: 'mltrader', text: 'Anyone tested bandits on crypto? Thinking the exploration could handle regime changes better' }
            ];
            break;
        case 'markets':
            messages = [
                { time: '14:30', user: 'riskmanager', text: 'SPY just broke 485 resistance' },
                { time: '14:31', user: 'algoquant', text: 'Volume spike confirming the breakout' },
                { time: '14:32', user: 'system', text: 'Market Alert: VIX down 8% in last hour' },
                { time: '14:33', user: 'quantdev', text: 'Tech sector leading the rally' }
            ];
            break;
        case 'screener':
            messages = [
                { time: '14:25', user: 'mltrader', text: 'Anyone seeing good momentum setups today?' },
                { time: '14:26', user: 'algoquant', text: 'Yeah, screening for RSI < 30 + volume spike' },
                { time: '14:27', user: 'quantdev', text: 'Check NVDA - breaking out of consolidation' }
            ];
            break;
        case 'lab':
            messages = [
                { time: '14:20', user: 'quantdev', text: 'Just backtested a transformer model - 3.2 Sharpe!' },
                { time: '14:21', user: 'mltrader', text: 'Can you share the config? That\'s incredible' },
                { time: '14:22', user: 'newbie_quant', text: 'Quick question - why is my bollinger strategy failing?' },
                { time: '14:23', user: 'riskmanager', text: 'Probably regime issues, try adding volatility filters' }
            ];
            break;
    }
    
    messages.forEach(msg => {
        if (msg.user === 'system') {
            addSystemMessage(msg.text, msg.time);
        } else {
            addChatMessage(msg.user, msg.text, msg.time);
        }
    });
}

function toggleChat() {
    chatOpen = !chatOpen;
    const panel = document.getElementById('chatPanel');
    const button = document.querySelector('.chat-toggle');
    const badge = document.querySelector('.chat-badge');
    
    if (chatOpen) {
        panel.classList.add('open');
        button.classList.add('active');
        if (badge) badge.style.display = 'none';
    } else {
        panel.classList.remove('open');
        button.classList.remove('active');
    }
}

function switchChatTab(channel) {
    currentChannel = channel;
    
    // Update active tab
    document.querySelectorAll('.chat-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update header
    document.querySelector('.chat-header span').textContent = channel;
    
    // Clear and reload messages for this channel
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = '';
    
    // Load channel-specific messages
    loadChannelMessages(channel);
}

function loadChannelMessages(channel) {
    let messages = [];
    
    switch(channel) {
        case '#general':
            messages = [
                { time: '14:40', user: 'quantdev', text: 'Great community here, love the discussions' },
                { time: '14:41', user: 'mltrader', text: 'Agreed, much better signal-to-noise than other forums' }
            ];
            break;
        case '#market':
            messages = [
                { time: '14:35', user: 'algoquant', text: 'Market looking strong today' },
                { time: '14:36', user: 'system', text: 'Economic Calendar: Fed minutes at 2pm EST' }
            ];
            break;
        case '#strategies':
            messages = [
                { time: '14:30', user: 'mltrader', text: 'Working on a new mean reversion strategy' },
                { time: '14:31', user: 'quantdev', text: 'Bollinger bands or RSI based?' }
            ];
            break;
        case '#help':
            messages = [
                { time: '14:25', user: 'newbie_quant', text: 'How do I prevent overfitting?' },
                { time: '14:26', user: 'riskmanager', text: 'Start with out-of-sample testing' }
            ];
            break;
    }
    
    messages.forEach(msg => {
        if (msg.user === 'system') {
            addSystemMessage(msg.text, msg.time);
        } else {
            addChatMessage(msg.user, msg.text, msg.time);
        }
    });
}

function handleChatInput(event) {
    if (event.key === 'Enter') {
        const input = event.target;
        const message = input.value.trim();
        
        if (message) {
            addChatMessage('you', message);
            input.value = '';
            
            // Simulate response
            setTimeout(() => {
                const responses = getResponsesForChannel(currentChannel);
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addChatMessage('quantdev', randomResponse);
            }, 1000 + Math.random() * 2000);
        }
    }
}

function getResponsesForChannel(channel) {
    const responseMap = {
        '#general': [
            'Interesting point!',
            'Good find, thanks for sharing',
            'I\'ve seen similar patterns',
            'What\'s your sample size?'
        ],
        '#market': [
            'Watching that level too',
            'Volume confirms the move',
            'Check the VIX',
            'Sector rotation in play'
        ],
        '#strategies': [
            'Try backtesting that',
            'What\'s your Sharpe ratio?',
            'Consider regime filters',
            'Watch for overfitting'
        ],
        '#help': [
            'Check the docs',
            'Try starting simple',
            'Common mistake',
            'Happy to help!'
        ]
    };
    
    return responseMap[channel] || responseMap['#general'];
}

function addChatMessage(username, text, timestamp = null) {
    const messagesContainer = document.getElementById('chatMessages');
    const now = new Date();
    const time = timestamp || (now.getHours().toString().padStart(2, '0') + ':' + 
                    now.getMinutes().toString().padStart(2, '0'));
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    messageDiv.innerHTML = `
        <span class="chat-timestamp">${time}</span>
        <span class="chat-username">${username}</span>
        <span class="chat-text">${text}</span>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addSystemMessage(text, timestamp = null) {
    const messagesContainer = document.getElementById('chatMessages');
    const now = new Date();
    const time = timestamp || (now.getHours().toString().padStart(2, '0') + ':' + 
                    now.getMinutes().toString().padStart(2, '0'));
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-system';
    messageDiv.innerHTML = `
        <span class="chat-timestamp">${time}</span>
        <span>tradingbot: ${text}</span>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function simulateMessages() {
    if (Math.random() > 0.7) {
        const currentPage = getCurrentPage();
        const messagePool = getMessagesForPage(currentPage);
        const users = ['algoquant', 'riskmanager', 'mltrader', 'quantdev'];
        
        const randomMessage = messagePool[Math.floor(Math.random() * messagePool.length)];
        const randomUser = users[Math.floor(Math.random() * users.length)];
        
        addChatMessage(randomUser, randomMessage);
        
        // Show notification badge if chat is closed
        if (!chatOpen) {
            const badge = document.querySelector('.chat-badge');
            if (badge) {
                const currentCount = parseInt(badge.textContent) || 0;
                badge.textContent = currentCount + 1;
                badge.style.display = 'flex';
            }
        }
    }
}

function getMessagesForPage(page) {
    const messageMap = {
        'forum': [
            'New research paper on factor investing just dropped',
            'Great post on regime detection',
            'That ML strategy discussion was helpful',
            'Love this community'
        ],
        'markets': [
            'SPY breaking key resistance',
            'VIX spiking, watch risk',
            'Tech sector rotation continues',
            'Options flow looking bullish'
        ],
        'screener': [
            'Finding good setups today',
            'High volume breakouts to watch',
            'Momentum looking strong',
            'Check these RSI extremes'
        ],
        'lab': [
            'Just optimized my strategy',
            'Backtest results look promising',
            'Anyone try ensemble methods?',
            'Risk management is key'
        ]
    };
    
    return messageMap[page] || messageMap['forum'];
}