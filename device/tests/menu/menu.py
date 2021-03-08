# -*- coding: utf-8 -*-
import curses


menu = ["Home", "Play", "Scoreboard", "Exit"]


def print_menu(stdscr, selected_menu_option_index):
	h, w = stdscr.getmaxyx()

	for i, option_text in enumerate(menu):
		x = w / 2 - len(option_text) / 2
		y = h / 2 - len(menu) / 2 + i
		if i == selected_menu_option_index:
			stdscr.attron(curses.color_pair(1))
			stdscr.addstr(y, x, option_text)
			stdscr.attroff(curses.color_pair(1))
		else:
			stdscr.addstr(y, x, option_text)


def main(stdscr):
	curses.curs_set(0)
	curses.init_pair(1, curses.COLOR_BLACK, curses.COLOR_WHITE)
	current_menu_option_index = 0

	print_menu(stdscr, current_menu_option_index)

	while True:
		key = stdscr.getch()

		stdscr.clear()

		if key == curses.KEY_UP and current_menu_option_index > 0:
			current_menu_option_index -= 1
		elif key == curses.KEY_DOWN and current_menu_option_index < len(menu) - 1:
			current_menu_option_index += 1
		elif key == curses.KEY_ENTER or key in [10, 13]:
			if current_menu_option_index == len(menu) - 1:
				break
			stdscr.clear()
			stdscr.addstr(0, 0, "You selected the option '%s'!" % menu[current_menu_option_index])
			stdscr.refresh()
			stdscr.getch()

		print_menu(stdscr, current_menu_option_index)

		stdscr.refresh()


curses.wrapper(main)
