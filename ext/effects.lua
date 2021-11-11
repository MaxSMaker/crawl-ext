local esc = string.char(27)
local eol = string.char(13)

EXT.effects.HEAL = function()
    crawl.sendkeys("&h")
end

EXT.effects.MONEY = function()
    crawl.sendkeys("&o$1000" .. eol)
end

EXT.effects.ACQUIREMENT = function()
    crawl.sendkeys("&%scroll of acquirement" .. eol)
    -- crawl.sendkeys("&a")
end

EXT.effects.XOM = function()
    crawl.sendkeys("&X" .. eol)
end

EXT.effects.MAP = function()
    crawl.sendkeys("&{")
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

EXT.effects.DETECT = function()
    crawl.sendkeys("&D")
end

EXT.effects.KILL_ALL = function()
    crawl.sendkeys("&G")
end

-- EXT.effects.DIE = function()
--     crawl.mpr("You are dead... Nothing personal, it's just business.")
--     crawl.sendkeys("*Qyes" .. eol)
-- end
