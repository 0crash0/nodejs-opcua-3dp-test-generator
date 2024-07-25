package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
)

func main() {
	file, err := os.Open("gcode/CFFFP_Schneekugel.gcode")
	if err != nil {
		log.Fatal(err)
	}

	scanner := bufio.NewScanner(file)
	scanner.Split(bufio.ScanLines)

	commands := make(map[string]*Command)

	for scanner.Scan() {
		line := scanner.Text()
		if !strings.HasPrefix(line, ";") && len(line) > 0 {
			command, args := parseGCodeLine(line)
			command.Valid = validateCommand(command.Name, args)
			commands[command.Name] = command
		}
	}
	fmt.Println(len(commands))
	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	for commandName, command := range commands {
		if command.Valid {
			fmt.Println(commandName, command.Args)
		}
	}

}

func parseGCodeLine(line string) (*Command, []string) {
	parts := strings.Fields(line)
	command := &Command{Name: parts[0]}
	if len(parts) > 1 {
		command.Args = parts[1:]
	}
	return command, command.Args
}

type Command struct {
	Name  string
	Args  []string
	X     float64
	Y     float64
	Z     float64
	Valid bool
}

func validateCommand(name string, args []string) bool {
	if name == "G0" || name == "G1" {
		if len(args) != 3 {
			return false
		}
		/*x, err := strconv.ParseFloat(args[0], 64)
		if err != nil {
			return false
		}
		y, err := strconv.ParseFloat(args[1], 64)
		if err != nil {
			return false
		}
		z, err := strconv.ParseFloat(args[2], 64)
		if err != nil {
			return false
		}
			command.X = x
			command.Y = y
			command.Z = z*/
		return true
	} else if name == "M0" || name == "M1" {

		// Здесь вы можете добавить логику для проверки параметров команд M0 и M1
		return true
	} else if name == "M104" {
		//println(name)
		// Здесь вы можете добавить логику для проверки параметров команды M104
		return true
	}
	// Здесь вы можете добавить логику для проверки других команд и их параметров
	return true
}
