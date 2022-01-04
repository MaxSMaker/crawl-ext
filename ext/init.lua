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
            if EXT.effects[value] then
                crawl.mpr("Incoming event:" .. value)
                EXT.effects[value]()
                crawl.more()
            end
        end
    end
end
