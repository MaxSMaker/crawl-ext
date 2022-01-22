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

function ProcessExt()
    if RELOAD_EFFECTS then
        EXT.effects = {}
        dofile("ext/effects.lua")
        dofile("ext/lives.lua")
    end

    dofile("ext/.msg.lua")

    local events = EXT.events
    local processed = EXT.events_processed

    EXT.events = {}
    EXT.events_processed = events

    for key, value in pairs(events) do
        if processed[key] == nil then
            local words = string.gmatch(value, "[^%s]+")
            local event = words()
            if EXT.effects[event] then
                crawl.mpr("INCOMING EVENT: " .. value)
                crawl.more()
                EXT.effects[event]()
            end
        end
    end
end
