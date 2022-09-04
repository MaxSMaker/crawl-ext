local esc = string.char(27)
local eol = string.char(13)

if not you.wizard() then
    crawl.sendkeys("&yes" .. eol .. esc)
    crawl.mpr("WizMod initiated!")
end

EXT = {}
EXT.effects = {}
dofile("ext/effects.lua")
dofile("ext/lives.lua")
local RELOAD_EFFECTS = true

EXT.events = {}
dofile("ext/.msg.lua")
EXT.events_processed = EXT.events
EXT.events = {}
EXT.inner_events = {}

function ProcessExt()
    if RELOAD_EFFECTS then
        EXT.effects = {}
        dofile("ext/effects.lua")
        dofile("ext/lives.lua")
    end

    if EXT.next_hook then
        local hook = EXT.next_hook
        EXT.next_hook = nil
        hook()
        crawl.sendkeys("&" .. esc)
        return
    end

    EXT.events = {}
    dofile("ext/.msg.lua")

    crawl.enable_more(true)
    crawl.setopt("channel.prompt = on")
    for key, value in pairs(EXT.events) do
        if EXT.events_processed[key] == nil then
            EXT.events_processed[key] = true
            local words = string.gmatch(value, "[^%s]+")
            local event = words()
            if EXT.effects[event] then
                crawl.mpr("INCOMING EVENT: " .. value)
                crawl.more()
                crawl.enable_more(false)
                crawl.setopt("channel.prompt = mute")
                EXT.effects[event]()
                crawl.sendkeys("&" .. esc)
                return
            end
        end
    end
end
