package main

import (
	"bufio"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"
)

func readLines(url string) ([]string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return nil, errors.New("Non-OK status in responce")
	}

	var lines []string
	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	return lines, nil
}

func process(url string, data map[string]bool) (map[string]bool, error) {
	s, err := readLines(url)
	if err != nil {
		return data, err
	}
	newData := make(map[string]bool)

	for _, v := range s {
		_, ok := data[v]
		if !ok {
			args := strings.Split(v, ",")
			fmt.Printf("EXT.events[\"%s\"] = \"%s\"\n", v, args[1])
		}
		newData[v] = true
	}

	return newData, nil
}

func main() {

	if len(os.Args) != 2 || os.Args[1] == "-h" {
		fmt.Println("Use link to CSV like \"https://docs.google.com/spreadsheets/d/<DOC-ID>/export?format=csv\"")
		fmt.Println("Script output must be redirected to .msg.lua file")
		os.Exit(1)
	}

	url := os.Args[1]

	var data map[string]bool
	var err error

	for {
		data, err = process(url, data)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %s\n", err)
		}
		time.Sleep(time.Second)
	}
}
