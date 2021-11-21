local esc = string.char(27)
local eol = string.char(13)

EXT.effects.HEAL = function()
    crawl.sendkeys("&H")
end

EXT.effects.MONEY = function()
    local gold = you.gold() + 1000
    crawl.sendkeys("&$" .. gold .. eol)
end

EXT.effects.NO_MONEY = function()
    local gold = you.gold() - 1000
    if gold < 0 then
        gold = 0
    end
    crawl.sendkeys("&$" .. gold .. eol)
end

EXT.effects.ACQUIREMENT = function()
    crawl.sendkeys("&%scroll of acquirement" .. eol)
end

EXT.effects.XOM = function()
    crawl.sendkeys("&X" .. eol)
end

EXT.effects.EXPLORE = function()
    crawl.sendkeys("&{&D")
end

EXT.effects.IDENTIFY = function()
    crawl.sendkeys("&i")
end

EXT.effects.UNIDENTIFY = function()
    crawl.sendkeys("&I")
end

EXT.effects.KNOWLEDGE = function()
    crawl.sendkeys("&y")
end

EXT.effects.UNKNOWLEDGE = function()
    crawl.sendkeys("&Y")
end

EXT.effects.RELEVEL = function()
    crawl.sendkeys("&*r")
end

EXT.effects.BLINK = function()
    crawl.sendkeys("&zBlink" .. eol)
end

EXT.effects.KILL_ALL = function()
    crawl.sendkeys("&G")
end

EXT.effects.MUTATION = function()
    crawl.sendkeys("&]any" .. eol)
end
