package main

import (
	"errors"
	"math"
	"slices"
	"sort"
	"strconv"
	"strings"
)

type Point struct {
	Id        int
	X         int
	Y         int
	Z         int
	Edges     map[int]float64
	Connected map[int]struct{} // set
}

type Edge struct {
	P1     int
	P2     int
	Weight float64
}

func calculateDistance(point1, point2 Point) float64 {
	dX := point1.X - point2.X
	dY := point1.Y - point2.Y
	dZ := point1.Z - point2.Z
	distance := math.Sqrt(float64(dX*dX + dY*dY + dZ*dZ))
	return distance
}

func makePoints(lines []string) ([]Point, error) {
	points := make([]Point, len(lines))

	for i, line := range lines {
		coordinatesString := strings.Split(line, ",")
		var coordinatesInt [3]int
		for j := range coordinatesString {
			coordinate, err := strconv.Atoi(coordinatesString[j])
			if err != nil {
				return nil, err
			}
			coordinatesInt[j] = coordinate
		}
		connected := make(map[int]struct{})
		connected[i] = struct{}{}
		point := Point{
			Id:        i,
			X:         coordinatesInt[0],
			Y:         coordinatesInt[1],
			Z:         coordinatesInt[2],
			Edges:     make(map[int]float64),
			Connected: connected,
		}
		points[i] = point
	}
	return points, nil
}

func makeEdges(points []Point) []Edge {
	edges := make([]Edge, (len(points) * (len(points) - 1) / 2))
	counter := 0

	for i := range points {
		for j := i + 1; j < len(points); j++ {
			distance := calculateDistance(points[i], points[j])
			edge := Edge{
				P1:     i,
				P2:     j,
				Weight: distance,
			}
			points[i].Edges[points[j].Id] = distance
			points[j].Edges[points[i].Id] = distance
			edges[counter] = edge
			counter++
		}
	}

	return edges
}

func sortHelper(edge1, edge2 Edge) int {
	switch {
	case edge1.Weight < edge2.Weight:
		return -1
	case edge1.Weight > edge2.Weight:
		return 1
	default:
		return 0
	}
}

func runSpanningTree(points []Point, edges []Edge, nIter int) []Point {

	for i := range nIter {
		edge := edges[i]
		p1 := points[edge.P1]
		p2 := points[edge.P2]
		_, exists := p1.Connected[p2.Id]
		if exists {
			continue
		}

		for id := range p2.Connected {
			p1.Connected[id] = struct{}{}
		}
		// Now p1 has all neighbours from p2, so update all
		// points to be that list
		for id := range p1.Connected {
			points[id].Connected = p1.Connected
		}
	}

	return points
}

func runFullSpanningTree(points []Point, edges []Edge) int {
	addedEdges := 0

	for i := range len(edges) {
		edge := edges[i]
		p1 := points[edge.P1]
		p2 := points[edge.P2]
		_, exists := p1.Connected[p2.Id]
		if exists {
			continue
		}
		addedEdges++
		for id := range p2.Connected {
			p1.Connected[id] = struct{}{}
		}
		// Now p1 has all neighbours from p2, so update all
		// points to be that list
		for id := range p1.Connected {
			points[id].Connected = p1.Connected
		}
		if addedEdges == len(points)-1 {
			return p1.X * p2.X
		}
	}

	return -1
}

func findCliques(points []Point) []int {
	visitedSet := make(map[int]struct{})
	cliqueSizes := make([]int, 0)

	for _, point := range points {
		_, visited := visitedSet[point.Id]
		if visited {
			continue
		}
		cliqueSize := len(point.Connected)
		cliqueSizes = append(cliqueSizes, cliqueSize)
		for id := range point.Connected {
			visitedSet[id] = struct{}{}
		}
	}

	sort.Slice(cliqueSizes, func(i, j int) bool {
		return cliqueSizes[i] > cliqueSizes[j]
	})
	return cliqueSizes
}

func Task8(filename, task string) error {
	if task != "a" && task != "b" {
		println("Argument `task` must be either `a` or `b`. Was: ", task)
		return errors.New("invalid argument")
	}

	lines, err := ReadInput(filename, "\n")
	if err != nil {
		panic(err)
	}

	points, err := makePoints(lines)
	if err != nil {
		return nil
	}
	edges := makeEdges(points)
	slices.SortFunc(edges, sortHelper)
	result := 0

	switch task {
	case "a":
		points = runSpanningTree(points, edges, 1000)
		cliqueSizes := findCliques(points)
		result = cliqueSizes[0] * cliqueSizes[1] * cliqueSizes[2]
	case "b":
		result = runFullSpanningTree(points, edges)
	}

	println(result)
	return nil
}
