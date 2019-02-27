module Page.Template exposing (viewApp)

import Html exposing (Html, header, section, h1, ul, li, text, img, a, br, nav, div, span)
import Html.Attributes exposing (id, src, href, class, attribute)
import Html.Events exposing (onClick)

viewApp : List (Html msg) -> Maybe a -> msg -> List (Html msg)
viewApp content user msg =
    [ header []
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
                    , attribute "aria-target" "navbar-main"
                    ] []
                , span [ attribute "aria-hidden" "true" ] []
                , span [ attribute "aria-hidden" "true" ] []
                , span [ attribute "aria-hidden" "true" ] []
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
                                        [ class "button is-light"
                                        , href "/login.html"
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
    , section [ class "section" ]
        [ div [ class "container" ]
            content
        ]
    ]
