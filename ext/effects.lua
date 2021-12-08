local esc = string.char(27)
local eol = string.char(13)

--[[
EXT.effects.HEAL = function()
    crawl.sendkeys("&H")
end
--]]

--[[
EXT.effects.XOM = function()
    crawl.sendkeys("&X" .. eol)
end
--]]

--[[
EXT.effects.KNOWLEDGE = function()
    crawl.sendkeys("&y")
end

EXT.effects.UNKNOWLEDGE = function()
    crawl.sendkeys("&Y")
end
 --]]

--[[
EXT.effects.KILL_ALL = function()
    crawl.sendkeys("&G")
end
--]]

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
    crawl.sendkeys("&%scroll of acquirement q:1" .. eol)
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

EXT.effects.RELEVEL = function()
    crawl.sendkeys("&*r")
end

EXT.effects.BLINK = function()
    crawl.sendkeys("&zBlink" .. eol)
end

EXT.effects.MUTATION = function()
    crawl.sendkeys("&]any" .. eol)
end

EXT.effects.MUT_CLEAR = function()
<<<<<<< HEAD
    crawl.call_dlua("you.delete_all_mutations(\"ext\");")
end

EXT.effects.BANISH_YOURSELF = function()
    crawl.sendkeys("&*b")
end

EXT.effects.XOM_GIFT = function()
    crawl.sendkeys("&Xgift".. eol)
end

EXT.effects.XOM_CONFUSE = function()
    crawl.sendkeys("&Xconfuse" .. eol)
end

EXT.effects.XOM_RANDOM_TELEPORT = function()
    crawl.sendkeys("&Xtele" .. eol)
end

EXT.effects.BANISH_MONSTER = function()
    crawl.sendkeys("&cx" .. eol)
end

EXT.effects.TURN_INTO_BAT = function()
    crawl.sendkeys("&ph")
end

EXT.effects.GODS_GIFT = function()
    crawl.sendkeys("&-")
end

EXT.effects.EXP_POTION = function()
    crawl.sendkeys("&%potion of experience q:1" .. eol)
end

EXT.effects.SUMMON_FRIEND = function()
    crawl.sendkeys("&mgenerate_awake random att:friendly" .. eol)
end

EXT.effects.SUMMON_MONSTER = function()
    crawl.sendkeys("&mgenerate_awake random att:hostile" .. eol)
end

EXT.effects.XOM_ANIMATE_MONSTER_WEAPON = function()
    crawl.sendkeys("&Xanimate monster weapon" .. eol)
end

EXT.effects.XOM_BAD_ENCHANT_MONSTER = function()
    crawl.sendkeys("&Xbad enchant monster" .. eol)
end

EXT.effects.BLINK_MONSTERS_CLOSE = function()
    crawl.sendkeys("&Xblink monsters" .. eol)
end

EXT.effects.MARK = function()
    crawl.sendkeys("&*dmark" .. eol .. 100 .. eol)
end

EXT.effects.BERSERK = function()
    crawl.sendkeys("&*dberserk" .. eol .. 100 .. eol)
end

=======
    crawl.call_dlua("you.delete_all_mutations(\"ext\");");
end
>>>>>>> 49d774561d04689e35bf11666211bbf11083172e
