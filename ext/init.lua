local esc = string.char(27)
local eol = string.char(13)

EXT = {}
EXT.effects = {}
dofile("ext/effects.lua")
dofile("ext/lives.lua")
local realoadEffects = true

EXT.events = {}
dofile("ext/.msg.lua")
EXT.events_processed = EXT.events
EXT.events = {}

if not you.wizard() then
    crawl.sendkeys("&yes" .. eol .. esc)
    crawl.mpr("WizMod initiated!")
end

function ProcessExt()
    if realoadEffects then
        EXT.effects = {}
        dofile("ext/effects.lua")
        dofile("ext/lives.lua")
    end

    dofile("ext/.msg.lua")

    for key, value in pairs(EXT.events) do
        if EXT.events_processed[key] == nil then
            if EXT.effects[value] then
                EXT.effects[value]()
            end
        end
    end

    EXT.events_processed = EXT.events
    EXT.events = {}
end
