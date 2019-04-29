module Page.Template exposing (viewApp, viewSection, viewInput)

import Html exposing (Html, header, footer, section, h1, ul, li, p, strong, text, label, input, img, a, br, nav, div, span)
import Html.Attributes exposing (id, src, href, class, attribute, placeholder, type_, required, value)
import Html.Events exposing (onClick, onInput)

appendMaybe : String -> Maybe String -> String
appendMaybe base moreMaybe =
    case moreMaybe of
        Nothing -> base
        Just more -> base ++ " " ++ more

viewInput : String -> String -> String -> String -> String -> (String -> msg) -> Html msg
viewInput inputLabel inputType inputId inputPlaceholder inputValue inputMsg =
    div [ class "field is-horizontal" ]
        [ div [ class "field-label is-normal" ]
            [ label [ class "label" ] [ text inputLabel ] ]
        , div [ class "field-body" ]
            [ div [ class "field is-narrow" ]
                [ div [ class "control" ]
                    [ input [ class "input", type_ inputType, id inputId, placeholder inputPlaceholder, required True, value inputValue, onInput inputMsg ] []
                    ]
                ]
            ]
        ]

viewSection : Maybe String -> Maybe String -> List (Html msg) -> Html msg
viewSection idAttrMaybe classAttrMaybe contents =
    section
        ( case idAttrMaybe of
            Nothing -> [ class ( appendMaybe "section" classAttrMaybe ) ]
            Just idAttr -> [ id idAttr, class ( appendMaybe "section" classAttrMaybe ) ])
        [ div [ class "container" ]
            contents
        ]

viewApp : List (Html msg) -> Maybe a -> msg -> List (Html msg)
viewApp sections user msg =
    header []
        [ nav
            [ class "navbar"
            , attribute "role" "navigation"
            , attribute "aria-label" "main navigation"
            ]
            [ div [ class "navbar-brand" ]
                [ a [ href "/", class "navbar-item" ]
                    [ text "memorize.ai" ]
                , a
                    [ class "navbar-burger burger"
                    , attribute "role" "button"
                    , attribute "aria-label" "menu"
                    , attribute "aria-expanded" "false"
                    , attribute "data-target" "navbar-main"
                    ]
                    [ span [ attribute "aria-hidden" "true" ] []
                    , span [ attribute "aria-hidden" "true" ] []
                    , span [ attribute "aria-hidden" "true" ] []
                    ]
                ]
            , div
                [ id "navbar-main"
                , class "navbar-menu"
                ]
                [ div [ class "navbar-start" ]
                    [
                    ]
                , div [ class "navbar-end" ]
                    [ div [ class "navbar-item" ]
                        [ div [ class "buttons" ]
                            [ case user of
                                Nothing ->
                                    a
                                        [ class "button is-highlighted"
                                        , href "login.html"
                                        ]
                                        [ text "Login" ]
                                Just _ ->
                                    a
                                        [ class "button is-light"
                                        , href "#"
                                        , onClick msg
                                        ]
                                        [ text "Sign out" ]
                            ]
                        ]
                    ]
                ]
            ]
        ]
    :: ( sections ++ [ footer [ class "footer" ]
        [ div [ class "content has-text-centered" ]
            [ p []
                [ strong [] [ text "memorize.ai" ]
                , text " by Ken Mueller"
                ]
            ]
        ]]
    )
