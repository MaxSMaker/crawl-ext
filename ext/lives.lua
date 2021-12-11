local esc = string.char(27)
local eol = string.char(13)

if EXT.lifes_init == nil then
    EXT.lifes_init = true
    if EXT_LIFES == nil then
        EXT_LIFES = 1
    end

    local prev = c_answer_prompt

    c_answer_prompt = function(prompt)
        if prompt == "Die?" then
            EXT_LIFES = EXT_LIFES - 1
            crawl.mpr("You are dead... Lifes: " .. EXT_LIFES)
            if EXT_LIFES == 0 then
                return true
            end

            EXT.events_processed["RESET"] = nil
            EXT.events["RESET"] = "inner_DISPERSAL"
            return false
        end

        if prev ~= nil then
            return prev(prompt)
        end
    end

    local live_save = function()
        return "EXT_LIFES = " .. EXT_LIFES .. "\n"
    end
    table.insert(chk_lua_save, live_save)
end

-- EXT.effects.KILL = function()
--     EXT_LIFES = EXT_LIFES - 1
--     crawl.mpr("Life lost: " .. EXT_LIFES)
--     if EXT_LIFES == 0 then
--         crawl.sendkeys("*Qyes" .. eol)
--     end
-- end

EXT.effects.EXTRA_LIFE = function()
    EXT_LIFES = EXT_LIFES + 1
    crawl.mpr("Extra life: " .. EXT_LIFES)
end

EXT.effects.inner_DISPERSAL = function()
    crawl.sendkeys("&zDispersal" .. eol)
end
