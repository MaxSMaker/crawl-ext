local esc = string.char(27)
local eol = string.char(13)

local USE_INHERITANCE = true

local SAVE_SCROLLS = function()
    local inheritance = {}
    for _, value in pairs(items.inventory()) do
        if value:class(true) == "Scrolls" then
            if value.fully_identified then
                inheritance[#inheritance + 1] = "&%Scroll of " .. value:subtype() .. " q:" .. value.quantity .. eol
            end
        end
    end
    c_persist.INHERITANCE = inheritance
end

local LOAD_SCROLLS = function()
    if c_persist.INHERITANCE then
        for _, value in pairs(c_persist.INHERITANCE) do
            crawl.sendkeys(value)
        end
        c_persist.INHERITANCE = nil
        crawl.sendkeys("g*" .. eol)
        crawl.sendkeys("&i")
    end
end

if EXT.lifes_init == nil then
    EXT.lifes_init = true
    if EXT_LIFES == nil then
        EXT_LIFES = 1
    end

    if USE_INHERITANCE then
        LOAD_SCROLLS()
    end

    local prev = c_answer_prompt

    c_answer_prompt = function(prompt)
        if prompt == "Die?" then
            EXT_LIFES = EXT_LIFES - 1
            crawl.mpr("You are dead... Lifes: " .. EXT_LIFES)
            if EXT_LIFES == 0 then
                if USE_INHERITANCE then
                    SAVE_SCROLLS()
                end
                return true
            end

            EXT.next_hook = function()
                crawl.sendkeys("&zBlink" .. eol)
            end
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
